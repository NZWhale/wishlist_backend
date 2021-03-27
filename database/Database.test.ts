import WishListFileDatabase from "./Database";
import fs from "fs";
import tmp from "tmp"
import path from "path"
import {IWishListDb} from "./interfaces";

jest.mock('nanoid')


describe("createMagicId", () => {
    test("should create and return magic ID", async () => {
        const dbFilePath = "./data/testDb"
        const db = new WishListFileDatabase(dbFilePath);
        const magicId = await db.createMagicId("farglowparty@gmail.com");
        expect(magicId).toBe("xxxxxxxxxx")
    })

    test("should create new user entity it doesn't exist", async () => {
        const dbFilePath = path.join(tmp.dirSync().name, "db.json")
        const db = new WishListFileDatabase(dbFilePath);
        await db.createMagicId("farglowparty@gmail.com");
        const fileContent = await fs.promises.readFile(dbFilePath, {
            encoding: "utf-8"
        });
        const dbContent = JSON.parse(fileContent)
        expect(dbContent).toEqual({
            rooms: [],
            users: [{
                email: "farglowparty@gmail.com",
                userId: "xxxxxxxxxx"
            }],
            sessions: [],
            wishes: [],
            authRequests: [{
                email: "farglowparty@gmail.com",
                token: "xxxxxxxxxxxxxxxx"
            }]
        } as IWishListDb)
    })

    test("should re-create magic id if it exists", () => {

    })
})