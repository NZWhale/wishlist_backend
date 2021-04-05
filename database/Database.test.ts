import WishListFileDatabase from "./Database";
import fs from "fs";
import tmp from "tmp"
import path from "path"

jest.mock('nanoid')

const createEmptyTestDatabase = () => {
    const dbFilePath = path.join(tmp.dirSync().name, "db.json")
    return {db: new WishListFileDatabase(dbFilePath), dbFilePath}
}

describe("createMagicId", () => {
    test("should create and return magic ID", async () => {
        const {db} = createEmptyTestDatabase();
        const magicId = await db.createMagicId("420@chill.com");
        expect(magicId).toBe("xxxxxxxxxxxxxxxx")
    })

    test("should create new user entity it doesn't exist", async () => {
        const {db, dbFilePath} = createEmptyTestDatabase();
        await db.createMagicId("420@chill.com");
        const fileContent = await fs.promises.readFile(dbFilePath, {
            encoding: "utf-8"
        });
        expect(fileContent).toMatchSnapshot()
    })

    // test("should re-create magic id if it exists", () => {
    //     const dbFilePath =createTestDbFile
    //     const db = createEmptyTestDatabase()
    // })
})

describe("authoriseUser", () => {
    test("should delete authorise request and create user session", async () => {
        const {db, dbFilePath} = createEmptyTestDatabase()
        await db.createMagicId("420@chill.com");
        const fileContentAfterCreatingMagicId = await fs.promises.readFile(dbFilePath, {
            encoding: "utf-8"
        });
        expect(fileContentAfterCreatingMagicId).toMatchSnapshot()
        const cookie = await db.authoriseUser("xxxxxxxxxxxxxxxx")
        expect(cookie).toBe('xxxxxxxxxxxxxxxxxx')
        const fileContentAfterAuthoriseUser = await fs.promises.readFile(dbFilePath, {
            encoding: "utf-8"
        });
        expect(fileContentAfterAuthoriseUser).toMatchSnapshot()
    })
})

describe("addNewWish", () => {
    test("should create new wish row in the wishes table", async () => {
        const {db, dbFilePath} = createEmptyTestDatabase()
        await db.createMagicId("420@chill.com");
        const fileContentAfterCreatingMagicId = await fs.promises.readFile(dbFilePath, {
            encoding: "utf-8"
        });
        expect(fileContentAfterCreatingMagicId).toMatchSnapshot()
        const cookie = await db.authoriseUser("xxxxxxxxxxxxxxxx")
        await db.addNewWish(cookie, 'Foo', 'Bar', true)
        const fileContentAfterAddingWish = await fs.promises.readFile(dbFilePath, {
            encoding: "utf-8"
        });
        expect(fileContentAfterAddingWish).toMatchSnapshot()
    })
})

describe("deleteWish", () => {
    test("should delete wish row from wishes table", async () => {
        const {db, dbFilePath} = createEmptyTestDatabase()
        await db.createMagicId("420@chill.com");
        const cookie = await db.authoriseUser("xxxxxxxxxxxxxxxx")
        await db.addNewWish(cookie, 'Foo', 'Bar', true)
        const fileContentAfterAddingWish = await fs.promises.readFile(dbFilePath, {
            encoding: "utf-8"
        });
        expect(fileContentAfterAddingWish).toMatchSnapshot()
        await db.deleteWish('xxxxxxxx')
        const fileContentAfterDeletingWish = await fs.promises.readFile(dbFilePath, {
            encoding: "utf-8"
        });
        expect(fileContentAfterDeletingWish).toMatchSnapshot()
    })
})

describe("editWish", () => {
    test("should edit wish row", async () => {
        const {db, dbFilePath} = createEmptyTestDatabase()
        await db.createMagicId("420@chill.com");
        const cookie = await db.authoriseUser("xxxxxxxxxxxxxxxx")
        await db.addNewWish(cookie, 'Foo', 'Bar', true)
        const fileContentAfterAddingWish = await fs.promises.readFile(dbFilePath, {
            encoding: "utf-8"
        });
        expect(fileContentAfterAddingWish).toMatchSnapshot()
        await db.editWish('xxxxxxxx', 'four', 'twenty')
        const fileContentAfterEditingWish = await fs.promises.readFile(dbFilePath, {
            encoding: "utf-8"
        });
        expect(fileContentAfterEditingWish).toMatchSnapshot()
    })
})

describe("getWishes", () => {
    test("should return all wishes of loggedIn user", async () => {
        const {db, dbFilePath} = createEmptyTestDatabase()
        await db.createMagicId("420@chill.com");
        const cookie = await db.authoriseUser("xxxxxxxxxxxxxxxx")
        await db.addNewWish(cookie, 'Foo', 'Bar', true)
        await db.addNewWish(cookie, 'Bar', 'Foo', true)
        const fileContentAfterAddingWish = await fs.promises.readFile(dbFilePath, {
            encoding: "utf-8"
        });
        expect(fileContentAfterAddingWish).toMatchSnapshot()
        const allWishesOfLoggedInUser = await db.getAllWishesOfLoggedInUser(cookie)
        const expectedWishes = [
            {
                "userId": "xxxxxxxxxx",
                "wishId": "xxxxxxxx",
                "title": "Foo",
                "description": "Bar",
                "isPublic": true,
            },
            {
                "userId": "xxxxxxxxxx",
                "wishId": "xxxxxxxx",
                "title": "Bar",
                "description": "Foo",
                "isPublic": true,
            }
        ]
        expect(allWishesOfLoggedInUser).toEqual(expectedWishes)
    })
    test('should return public wishes of user', async () => {
        const {db, dbFilePath} = createEmptyTestDatabase()
        await db.createMagicId("420@chill.com");
        const cookie = await db.authoriseUser("xxxxxxxxxxxxxxxx")
        await db.setUsername(cookie, 'FooUser')
        await db.addNewWish(cookie, 'Foo', 'Bar', true)
        await db.addNewWish(cookie, 'Private', 'Foo', false)
        await db.addNewWish(cookie, 'Bar', 'Foo', true)
        await db.addNewWish(cookie, 'Private', 'Bar', false)
        const fileContentAfterAddingWish = await fs.promises.readFile(dbFilePath, {
            encoding: "utf-8"
        });
        expect(fileContentAfterAddingWish).toMatchSnapshot()
        const publicWishesOfUser = await db.getPublicWishesOfUser('FooUser')
        const expectedWishes = [
            {
                "userId": "xxxxxxxxxx",
                "wishId": "xxxxxxxx",
                "title": "Foo",
                "description": "Bar",
                "isPublic": true,
            },
            {
                "userId": "xxxxxxxxxx",
                "wishId": "xxxxxxxx",
                "title": "Bar",
                "description": "Foo",
                "isPublic": true,
            }
        ]
        expect(publicWishesOfUser).toEqual(expectedWishes)
    })
})