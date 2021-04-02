import fs from "fs"
import {IWishListDb} from "./interfaces";
import {
    createAuthRequestRecord,
    createEmptyDbContent, createNewWishRecord, createSessionRecord,
    createUserRecord, deleteContentFromDb, getUserData, getUserEmailFromAuthRequests, getUserIdByCookie,
    isAuthRequestExist, isAuthRequestExistByToken, isSessionExist,
    isUserExist
} from "./dbRelatedFunctions";
import { nanoid } from "nanoid";
import {cookieLength, tokenLength, userIdLength} from "../addresses";

export default class WishListFileDatabase {
    private dbFilePath: string

    constructor(dbFilePath: string) {
        this.dbFilePath = dbFilePath
    }

    async createMagicId(userEmail: string): Promise<string> {
        const dbContent = await this.readDbContent()
        if(isAuthRequestExist(dbContent, userEmail)){
            deleteContentFromDb(dbContent, 'authRequests', userEmail)
        }
        const magicId = nanoid(tokenLength)
        createAuthRequestRecord(dbContent, magicId, userEmail)
        if(!isUserExist(dbContent, userEmail)) {
            const userId = nanoid(userIdLength)
            createUserRecord(dbContent, userId, userEmail)
        }
        await this.writeDbContent(dbContent)
        return magicId
    }

    async authoriseUser(token: string) {
        const dbContent = await this.readDbContent()
        const userEmail = getUserEmailFromAuthRequests(dbContent, token)
        const userData = getUserData(dbContent, userEmail)
        if(!userData) throw new Error("User doesn't exist in database")
        const cookie = nanoid(cookieLength)
        if(isAuthRequestExistByToken(dbContent, token)){
            deleteContentFromDb(dbContent, 'authRequests', userEmail)
        }
        if(isSessionExist(dbContent, userData.userId)){
            deleteContentFromDb(dbContent, 'sessions', userEmail)
        }
        createSessionRecord(dbContent, userData.userId, cookie)
        await this.writeDbContent(dbContent)
        return cookie
    }

    async addNewWish(cookie: string, wishTitle: string, wishDescription: string) {
        const dbContent = await this.readDbContent()
        const userId = getUserIdByCookie(dbContent, cookie)
        if(!userId) throw new Error("User doesn't exist in database")
        createNewWishRecord(dbContent, userId, wishTitle, wishDescription)
        await this.writeDbContent(dbContent)
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