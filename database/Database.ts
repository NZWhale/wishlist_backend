import fs from "fs"
import {IWishListDb} from "./interfaces";
import {
    addUserToRoom,
    createAuthRequestRecord,
    createEmptyDbContent,
    createNewRoom,
    createNewWishRecord,
    createSessionRecord,
    createUserRecord, deleteAuthRequestFromTable,
    deleteContentFromDb, deleteCookieFromSessionRow,
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
    isAuthRequestExistByToken, isEmailExistInDb,
    isUserExist, isUsernameBusy,
    returnWishIndex, setEmailConfirmationStatus,
    setUsername
} from "./dbRelatedFunctions";
import {confirmationCodeLength, cookieLength, magicIdLength, saltLength, userIdLength} from "../addresses";
import createRandomId from "../createRandomId";
import {customAlphabet} from "nanoid";
import {uppercase} from "nanoid-dictionary";
import bcrypt from "bcrypt";

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
            createUserRecord(dbContent, userId, userEmail, false)
        }
        await this.writeDbContent(dbContent)
        return magicId
    }

    async authoriseUserViaToken(token: string) {
        const dbContent = await this.readDbContent()
        const userEmail = getUserEmailFromAuthRequests(dbContent, token)
        if (!userEmail) {
            throw new Error('token is invalid')
        }
        const userData = getUserData(dbContent, userEmail)
        if (!userData) throw new Error("User doesn't exist in database")
        const cookie = createRandomId(cookieLength, token)
        if (isAuthRequestExistByToken(dbContent, token)) {
            deleteContentFromDb(dbContent, 'authRequests', userEmail)
        }
        //TODO: resolve this exception
        // if (isSessionExist(dbContent, userData.userId)) {
        //     deleteContentFromDb(dbContent, 'sessions', userEmail)
        // }
        createSessionRecord(dbContent, userData.userId, cookie)
        setEmailConfirmationStatus(dbContent, userEmail, true)
        await this.writeDbContent(dbContent)
        return cookie
    }

    async authoriseUserByLoginAndPassword(email: string, password: string) {
        const dbContent = await this.readDbContent()
        if (!isEmailExistInDb(dbContent, email)) {
            throw new Error("Email or password is not valid")
        }
        const user = getUserData(dbContent, email)
        if (!user) {
            throw new Error("user doesn't exist in database")
        }
        if (!user.password) {
            throw new Error("User doesn't have password")
        }
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            throw new Error("Email or password is not valid")
        }
        const userId = getUserIdByEmail(dbContent, email)
        if (!userId) {
            console.error(`userId doesnt exist in database after email and password validation. UserId: ${userId}`)
            throw new Error("Something goes wrong")
        }
        //TODO: resolve this exception
        // if (isSessionExist(dbContent, userId)) {
        //     deleteSessionFromDb(dbContent, userId)
        // }
        const cookie = createRandomId(cookieLength, userId)
        createSessionRecord(dbContent, userId, cookie)
        await this.writeDbContent(dbContent)
        return cookie
    }

    async registrationViaLoginAndPassword(email: string, password: string) {
        const dbContent = await this.readDbContent()
        if (isEmailExistInDb(dbContent, email)) {
            throw new Error("Email already exist")
        }
        const userId = createRandomId(userIdLength, email)
        const confirmationCode = createRandomId(confirmationCodeLength, email)
        bcrypt.genSalt(saltLength, (err, salt) => {
            if (err) {
                console.error(err)
                throw new Error("Something goes wrong with salt generating")
            }
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    console.error(err)
                    throw new Error("Something goes wrong with hash generating")
                }
                createUserRecord(dbContent, userId, email, false, hash, salt)
                createAuthRequestRecord(dbContent, confirmationCode, email)
                await this.writeDbContent(dbContent)
            });
        });
        return confirmationCode
    }

    async emailConfirmation(confirmationCode: string) {
        const dbContent = await this.readDbContent()
        const isAuthRequestExist = isAuthRequestExistByToken(dbContent, confirmationCode)
        if (!isAuthRequestExist) {
            throw new Error("Your confirmation link has expired")
        }
        const userEmail = getUserEmailFromAuthRequests(dbContent, confirmationCode)
        if (!userEmail) {
            throw new Error("Your confirmation link is invalid")
        }
        const userData = getUserData(dbContent, userEmail)
        if (!userData) {
            throw new Error("Your confirmation link is invalid")
        }
        if (userData.isEmailConfirmed) {
            throw new Error("Your email already confirmed")
        }
        setEmailConfirmationStatus(dbContent, userEmail, true)
        deleteAuthRequestFromTable(dbContent, userEmail)
        const cookie = createRandomId(cookieLength, userData.userId)
        createSessionRecord(dbContent, userData.userId, cookie)
        await this.writeDbContent(dbContent)
        return cookie
    }

    async setUsername(cookie: string, username: string) {
        const dbContent = await this.readDbContent()
        const userId = getUserIdByCookie(dbContent, cookie)
        if (!userId) {
            throw new Error("User doesn't exist in database")
        }
        if(isUsernameBusy(dbContent, username)){
            throw new Error('Username is busy')
        }
        setUsername(dbContent, userId, username)
        await this.writeDbContent(dbContent)
    }

    async deleteCookie(cookie: string) {
        const dbContent = await this.readDbContent()
        const userId = getUserIdByCookie(dbContent, cookie)
        if (!userId) {
            throw new Error("User doesn't exist in database")
        }
        deleteCookieFromSessionRow(dbContent, userId, cookie)
        await this.writeDbContent(dbContent)
    }

    async getUsernameByCookie(cookie: string): Promise<string | null> {
        const dbContent = await this.readDbContent()
        const userId = getUserIdByCookie(dbContent, cookie)
        if (!userId) {
            throw new Error("User doesn't exist in database")
        }
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
        return getUsernameByUserId(dbContent, userId)
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
        const addableUserId = getUserIdByEmail(dbContent, email)
        if (!addableUserId) throw new Error("User doesn't exist in database")
        addUserToRoom(dbContent, roomId, addableUserId)
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

    async addUserToRoomViaLink(cookie: string, roomId: string) {
        const dbContent = await this.readDbContent()
        const userId = getUserIdByCookie(dbContent, cookie)
        if (!userId) throw new Error("User doesn't exist in database")
        addUserToRoom(dbContent, roomId, userId)
        await this.writeDbContent(dbContent)
    }

    async editWish(wishId: string, title: string, description: string, isPublic: boolean | string[]) {
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