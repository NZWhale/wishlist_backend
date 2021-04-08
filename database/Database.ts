import fs from "fs"
import {IWishListDb} from "./interfaces";
import {
    createAuthRequestRecord,
    createEmptyDbContent,
    createNewWishRecord,
    createSessionRecord,
    createUserRecord,
    deleteContentFromDb,
    deleteWishRecord, editWishRecord, getAllWishesOfLoggedInUser, getPublicWishesByUserId,
    getUserData,
    getUserEmailFromAuthRequests,
    getUserIdByCookie, getUserIdByNickname, getUsernameByUserId,
    isAuthRequestExist,
    isAuthRequestExistByToken,
    isSessionExist,
    isUserExist,
    isWishExist, setUsername
} from "./dbRelatedFunctions";
import {nanoid} from "nanoid";
import {cookieLength, tokenLength, userIdLength} from "../addresses";

export default class WishListFileDatabase {
    private dbFilePath: string

    constructor(dbFilePath: string) {
        this.dbFilePath = dbFilePath
    }

    async createMagicId(userEmail: string): Promise<string> {
        const dbContent = await this.readDbContent()
        if (isAuthRequestExist(dbContent, userEmail)) {
            deleteContentFromDb(dbContent, 'authRequests', userEmail)
        }
        const magicId = nanoid(tokenLength)
        createAuthRequestRecord(dbContent, magicId, userEmail)
        if (!isUserExist(dbContent, userEmail)) {
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
        if (!userData) throw new Error("User doesn't exist in database")
        const cookie = nanoid(cookieLength)
        console.log(cookie)
        if (isAuthRequestExistByToken(dbContent, token)) {
            deleteContentFromDb(dbContent, 'authRequests', userEmail)
        }
        if (isSessionExist(dbContent, userData.userId)) {
            deleteContentFromDb(dbContent, 'sessions', userEmail)
        }
        createSessionRecord(dbContent, userData.userId, cookie)
        await this.writeDbContent(dbContent)
        return cookie
    }

    async setUsername(cookie: string, nickname: string) {
        const dbContent = await this.readDbContent()
        const userId = getUserIdByCookie(dbContent, cookie)
        if (!userId) throw new Error("User doesn't exist in database")
        setUsername(dbContent, userId, nickname)
        await this.writeDbContent(dbContent)
    }

    async getUsernameByCookie(cookie: string): Promise<string|null> {
        const dbContent = await this.readDbContent()
        const userId = getUserIdByCookie(dbContent, cookie)
        if (!userId) throw new Error("User doesn't exist in database")
        return getUsernameByUserId(dbContent, userId)
    }

    async getAllWishesOfLoggedInUser(cookie: string) {
        const dbContent = await this.readDbContent()
        const userId = getUserIdByCookie(dbContent, cookie)
        if (!userId) throw new Error("User doesn't exist in database")
        return getAllWishesOfLoggedInUser(dbContent, userId)
    }

    async getPublicWishesOfUser(nickname: string) {
        const dbContent = await this.readDbContent()
        const userId = getUserIdByNickname(dbContent, nickname)
        if (!userId) throw new Error("User doesn't exist in database")
        return getPublicWishesByUserId(dbContent, userId)
    }

    async addNewWish(cookie: string, wishTitle: string, wishDescription: string, isPublic: boolean) {
        const dbContent = await this.readDbContent()
        const userId = getUserIdByCookie(dbContent, cookie)
        if (!userId) throw new Error("User doesn't exist in database")
        createNewWishRecord(dbContent, userId, wishTitle, wishDescription, isPublic)
        await this.writeDbContent(dbContent)
    }

    async editWish(wishId: string, title: string, description: string, isPublic: boolean) {
        const dbContent = await this.readDbContent()
        const wishIndex = isWishExist(dbContent, wishId)
        if (wishIndex === false) throw new Error("WishRow doesn't exist in database")
        editWishRecord(dbContent, wishIndex, title, description, isPublic)
        await this.writeDbContent(dbContent)
    }

    async deleteWish(wishId: string) {
        const dbContent = await this.readDbContent()
        const wishIndex = isWishExist(dbContent, wishId)
        if (wishIndex === false) throw new Error("WishRow doesn't exist in database")
        deleteWishRecord(dbContent, wishIndex)
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