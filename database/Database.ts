import fs from "fs"
import {IWishListDb} from "./interfaces";
import {
    addUserToRoomTable,
    createAuthRequestRecord,
    createEmptyDbContent,
    createNewRoom,
    createNewWishRecord,
    createSessionRecord,
    createUserRecord,
    deleteContentFromDb,
    deleteWishRecord,
    editWishRecord,
    getAllRoomsOfUser,
    getAllWishesOfLoggedInUser,
    getPublicWishesByUserId,
    getUserData,
    getUserEmailFromAuthRequests,
    getUserIdByCookie, getUserIdByEmail,
    getUserIdByUsername,
    getUsernameByUserId,
    isAuthRequestExist,
    isAuthRequestExistByToken,
    isSessionExist,
    isUserExist,
    returnWishIndex,
    setUsername
} from "./dbRelatedFunctions";
import {cookieLength, magicIdLength, userIdLength} from "../addresses";
import createRandomId from "../createRandomId";
import {customAlphabet} from "nanoid";
import {uppercase} from "nanoid-dictionary";

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
        const nanoId = customAlphabet(uppercase, magicIdLength)
        const firstHalfOfId = await nanoId()
        const secondHalfOfId = await nanoId()
        const magicId = firstHalfOfId + '-' + secondHalfOfId
        createAuthRequestRecord(dbContent, magicId, userEmail)
        if (!isUserExist(dbContent, userEmail)) {
            const userId = createRandomId(userIdLength, userEmail)
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
        const cookie = createRandomId(cookieLength, token)
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

    async setUsername(cookie: string, username: string) {
        const dbContent = await this.readDbContent()
        const userId = getUserIdByCookie(dbContent, cookie)
        if (!userId) throw new Error("User doesn't exist in database")
        setUsername(dbContent, userId, username)
        await this.writeDbContent(dbContent)
    }

    async getUsernameByCookie(cookie: string): Promise<string | null> {
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

    async getWishesByUserId(userId: string) {
        const dbContent = await this.readDbContent()
        return getPublicWishesByUserId(dbContent, userId)
    }

    async getUsernameByUserId(userId: string) {
        const dbContent = await this.readDbContent()
        const username = getUsernameByUserId(dbContent, userId)
        console.log('username', username)
        return username
    }

    async getPublicWishesOfUser(username: string) {
        const dbContent = await this.readDbContent()
        const userId = getUserIdByUsername(dbContent, username)
        if (!userId) throw new Error("User doesn't exist in database")
        return getPublicWishesByUserId(dbContent, userId)
    }

    async createRoom(cookie: string, roomName: string) {
        const dbContent = await this.readDbContent()
        const userId = getUserIdByCookie(dbContent, cookie)
        if (!userId) throw new Error("User doesn't exist in database")
        createNewRoom(dbContent, userId, roomName)
        await this.writeDbContent(dbContent)
    }

    async addUserToRoom(cookie: string, roomId: string, email: string) {
        const dbContent = await this.readDbContent()
        const roomCreatorId = getUserIdByCookie(dbContent, cookie)
        if (!roomCreatorId) throw new Error("User doesn't exist in database")
        // const roomId = getRoomIdByCreaterId(dbContent, roomCreatorId)
        // if (!roomId) throw new Error("Room doesn't exist in database")
        const addableUserId = getUserIdByEmail(dbContent, email)
        if (!addableUserId) throw new Error("User doesn't exist in database")
        addUserToRoomTable(dbContent, roomId, addableUserId)
        await this.writeDbContent(dbContent)
    }

    async getRoomsOfLoggedInUser(cookie: string) {
        const dbContent = await this.readDbContent()
        const userId = getUserIdByCookie(dbContent, cookie)
        if (!userId) throw new Error("User doesn't exist in database")
        return getAllRoomsOfUser(dbContent, userId)
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
        const wishIndex = returnWishIndex(dbContent, wishId)
        if (wishIndex === false) throw new Error("WishRow doesn't exist in database")
        editWishRecord(dbContent, wishIndex, isPublic, title, description)
        await this.writeDbContent(dbContent)
    }

    async deleteWish(wishId: string, cookie: string) {
        const dbContent = await this.readDbContent()
        const userId = getUserIdByCookie(dbContent, cookie)
        if (!userId) throw new Error("User doesn't exist in database")
        const wishIndex = returnWishIndex(dbContent, wishId)
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