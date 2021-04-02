import WishListFileDatabase from "./Database";
import fs from "fs";
import tmp from "tmp"
import path from "path"

jest.mock('nanoid')

const createEmptyTestDatabase = () => {
    const dbFilePath = path.join(tmp.dirSync().name, "db.json")
    return { db: new WishListFileDatabase(dbFilePath), dbFilePath }
}

describe("createMagicId", () => {
    test("should create and return magic ID", async () => {
        const { db } = createEmptyTestDatabase();
        const magicId = await db.createMagicId("420@chill.com");
        expect(magicId).toBe("xxxxxxxxxxxxxxxx")
    })

    test("should create new user entity it doesn't exist", async () => {
        const { db, dbFilePath } = createEmptyTestDatabase();
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
        const { db, dbFilePath } = createEmptyTestDatabase()
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
        const { db, dbFilePath } = createEmptyTestDatabase()
        await db.createMagicId("420@chill.com");
        const fileContentAfterCreatingMagicId = await fs.promises.readFile(dbFilePath, {
            encoding: "utf-8"
        });
        expect(fileContentAfterCreatingMagicId).toMatchSnapshot()
        const cookie = await db.authoriseUser("xxxxxxxxxxxxxxxx")
        await db.addNewWish(cookie, 'Foo', 'Bar')
        const fileContentAfterAddingWish = await fs.promises.readFile(dbFilePath, {
            encoding: "utf-8"
        });
        expect(fileContentAfterAddingWish).toMatchSnapshot()
    })
})

describe("deleteWish", () => {
    test("should delete wish row from wishes table", async () => {
        const { db, dbFilePath } = createEmptyTestDatabase()
        await db.createMagicId("420@chill.com");
        const cookie = await db.authoriseUser("xxxxxxxxxxxxxxxx")
        await db.addNewWish(cookie, 'Foo', 'Bar')
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