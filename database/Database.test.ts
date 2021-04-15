import WishListFileDatabase from "./Database";
import fs from "fs";
import tmp from "tmp"
import path from "path"
import {setUsername} from "./dbRelatedFunctions";

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
        await db.deleteWish('xxxxxxxx', "xxxxxxxxxxxxxxxx")
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
        await db.editWish('xxxxxxxx', 'four', 'twenty', true)
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

describe("setUsername", () => {
    test("should set username", async () => {
        const {db, dbFilePath} = createEmptyTestDatabase()
        await db.createMagicId("420@chill.com");
        const cookie = await db.authoriseUser("xxxxxxxxxxxxxxxx")
        const fileContentAfterCreatingUser = await fs.promises.readFile(dbFilePath, {
            encoding: "utf-8"
        });
        expect(fileContentAfterCreatingUser).toMatchSnapshot()
        await db.setUsername(cookie, 'foobar')
        const fileContentAfterAddingUsername = await fs.promises.readFile(dbFilePath, {
            encoding: "utf-8"
        });
        expect(fileContentAfterAddingUsername).toMatchSnapshot()
    })
})

describe("getUsername", () => {
    test("should return username", async () => {
        const {db, dbFilePath} = createEmptyTestDatabase()
        await db.createMagicId("420@chill.com");
        const cookie = await db.authoriseUser("xxxxxxxxxxxxxxxx")
        await db.setUsername(cookie, 'foobar')
        const fileContentAfterAddingUsername = await fs.promises.readFile(dbFilePath, {
            encoding: "utf-8"
        });
        expect(fileContentAfterAddingUsername).toMatchSnapshot()
        const username = await db.getUsernameByCookie(cookie)
        expect(username).toBe('foobar')
    })
})

describe("createRoom", () => {
    test("should create new room in database", async () => {
        const {db, dbFilePath} = createEmptyTestDatabase()
        await db.createMagicId("420@chill.com");
        await db.authoriseUser("xxxxxxxxxxxxxxxx")
        const fileContentAfterAuthorise = await fs.promises.readFile(dbFilePath, {
            encoding: "utf-8"
        });
        expect(fileContentAfterAuthorise).toMatchSnapshot()
        await db.createRoom("xxxxxxxxxxxxxxxxxx", "DoobkiRoom")
        const fileContentAfterCreatingRoom = await fs.promises.readFile(dbFilePath, {
            encoding: "utf-8"
        });
        expect(fileContentAfterCreatingRoom).toMatchSnapshot()
    })
})

describe("addUserToRoom", () => {
    test("should add user to room", async () => {
        const {db, dbFilePath} = createEmptyTestDatabase()
        await db.createMagicId("420@chill.com");
        await db.authoriseUser("xxxxxxxxxxxxxxxx")
        await db.setUsername("xxxxxxxxxxxxxxxxxx", 'foobar')
        await db.createMagicId("420@chill.com");
        await db.createRoom("xxxxxxxxxxxxxxxxxx", "DoobkiRoom")
        await db.authoriseUser("xxxxxxxxxxxxxxxx")
        await db.setUsername("xxxxxxxxxxxxxxxxxx", 'barfoo')
        const fileContentAfterCreatingRoom = await fs.promises.readFile(dbFilePath, {
            encoding: "utf-8"
        });
        expect(fileContentAfterCreatingRoom).toMatchSnapshot()
        await db.addUserToRoom("xxxxxxxxxxxxxxxxxx", "barfoo")
        const fileContentAfterAddingUser = await fs.promises.readFile(dbFilePath, {
            encoding: "utf-8"
        });
        expect(fileContentAfterAddingUser).toMatchSnapshot()
    })
})

describe("getRoomsOfUser", () => {
    test("should return all rooms of logged in user", async () => {
        const {db, dbFilePath} = createEmptyTestDatabase()
        await db.createMagicId("420@chill.com");
        await db.authoriseUser("xxxxxxxxxxxxxxxx")
        await db.setUsername("xxxxxxxxxxxxxxxxxx", 'foobar')
        await db.createMagicId("420@chill.com");
        await db.createRoom("xxxxxxxxxxxxxxxxxx", "DoobkiRoom")
        await db.createRoom("xxxxxxxxxxxxxxxxxx", "Job")
        await db.createRoom("xxxxxxxxxxxxxxxxxx", "Family")
        const fileContentAfterCreatingRooms = await fs.promises.readFile(dbFilePath, {
            encoding: "utf-8"
        });
        expect(fileContentAfterCreatingRooms).toMatchSnapshot()
        const expectedRooms = [
            {
                creatorId: "xxxxxxxxxx",
                roomId: "xxxxxxxxxxxx",
                roomName: "DoobkiRoom",
                users: [
                    {
                        userId: "xxxxxxxxxx",
                        email: "420@chill.com",
                        nickname: "foobar"
                    }
                ]
            },
            {
                creatorId: "xxxxxxxxxx",
                roomId: "xxxxxxxxxxxx",
                roomName: "Job",
                users: [
                    {
                        userId: "xxxxxxxxxx",
                        email: "420@chill.com",
                        nickname: "foobar"
                    }
                ]
            },
            {
                creatorId: "xxxxxxxxxx",
                roomId: "xxxxxxxxxxxx",
                roomName: "Family",
                users: [
                    {
                        userId: "xxxxxxxxxx",
                        email: "420@chill.com",
                        nickname: "foobar"
                    }
                ]
            }
        ]
        const rooms = await db.getRoomsOfLoggedInUser("xxxxxxxxxxxxxxxxxx")
        expect(rooms).toEqual(expectedRooms)
    })
})