import fs from "fs"
import {IWishListDb} from "./interfaces";
import {createAuthRequestRecord, createEmptyDbContent, createUserRecord} from "./dbRelatedFunctions";
import { nanoid } from "nanoid";

export default class WishListFileDatabase {
    private dbFilePath: string

    constructor(dbFilePath: string) {
        this.dbFilePath = dbFilePath
    }

    async createMagicId(userEmail: string): Promise<string> {
        const dbContent = await this.readDbContent()
        // TODO: move magic id token size to config
        const magicId = nanoid(16)
        createAuthRequestRecord(dbContent, magicId, userEmail)
        // TODO: move user id token size to config
        const userId = nanoid(10)
        createUserRecord(dbContent, userId, userEmail)
        await this.writeDbContent(dbContent)
        return magicId
    }

    private async readDbContent(): Promise<IWishListDb> {
        try {
            // check if file exists
            await fs.promises.access(this.dbFilePath, fs.constants.R_OK | fs.constants.W_OK)
        } catch (e) {
            await this.writeDbContent(createEmptyDbContent())
        }
        const dbFileStringContent = await fs.promises.readFile(this.dbFilePath, {
            encoding: "utf-8"
        })
        return JSON.parse(dbFileStringContent)
    }

    private async writeDbContent(content: IWishListDb): Promise<void> {
        const emptyDbStringContent = JSON.stringify(content, null, 2);
        await fs.promises.writeFile(this.dbFilePath, emptyDbStringContent, {
            encoding: "utf-8"
        })
    }
}