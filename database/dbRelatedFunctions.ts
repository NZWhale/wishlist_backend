import {IAuthRequestRow, ISessionRow, IUserRow, IWishesRow, IWishListDb} from "./interfaces";
import {nanoid} from "nanoid";
import {wishIdLength} from "../addresses";

type Email = string
type UserId = string
type Cookie = string
type magicId = string
type Table = 'authRequests' | 'sessions'

export const createAuthRequestRecord = (dbContent: IWishListDb, magicId: magicId, userEmail: Email) => {
    const authRequestRecord: IAuthRequestRow = {
        token: magicId,
        email: userEmail
    }
    dbContent.authRequests.push(authRequestRecord)
}

export const createUserRecord = (dbContent: IWishListDb, userId: UserId, userEmail: Email) => {
    const userRecord: IUserRow = {
        userId: userId,
        email: userEmail
    }
    dbContent.users.push(userRecord)
}

export const createSessionRecord = (dbContent: IWishListDb, userId: UserId, cookie: Cookie) => {
    const sessionRecord: ISessionRow = {
        userId: userId,
        cookie: cookie
    }
    dbContent.sessions.push(sessionRecord)
}

export const isAuthRequestExist = (dbFileContent: IWishListDb, email: Email) => {
    const result = dbFileContent.authRequests.findIndex((authRequest: IAuthRequestRow) => authRequest.email === email)
    return result !== -1
}
export const isAuthRequestExistByToken = (dbFileContent: IWishListDb, token: string) => {
    const result = dbFileContent.authRequests.findIndex((authRequest: IAuthRequestRow) => authRequest.token === token)
    return result !== -1
}

export const isUserExist = (dbFileContent: IWishListDb, email: Email) => {
    const result = dbFileContent.users.findIndex(user => user.email === email)
    return result !== -1
}

export const isSessionExist = (dbFileContent: IWishListDb, userId: UserId) => {
    const result = dbFileContent.sessions.findIndex((session: ISessionRow) => session.userId === userId)
    return result !== -1
}

export const getUserEmailFromAuthRequests = (dbFileContent: IWishListDb, token: string) => {
    const result = dbFileContent.authRequests.find((authRequest: IAuthRequestRow) => authRequest.token === token)
    return result ? result.email : ""
}

export const getUserIdFromDb = (dbFileContent: IWishListDb, email: Email) => {
    const result = dbFileContent.users.find((user: IUserRow) => user.email === email)
    return result ? result.userId : ""
}

export const getUserIdByCookie = (dbFileContent: IWishListDb, cookie: Cookie) => {
    const result = dbFileContent.sessions.find((session: ISessionRow) => session.cookie === cookie)
    return result ? result.userId : ""
}

export const getUserData = (dbFileContent: IWishListDb, email: Email) => {
    return dbFileContent.users.find((user: IUserRow) => user.email === email)
}

export const deleteContentFromDb = (dbFileContent: IWishListDb, table: Table, email: Email) => {
    switch (table) {
        case 'authRequests':
            const authRequestIndex = dbFileContent.authRequests.findIndex((authRequest: IAuthRequestRow) => authRequest.email === email)
            dbFileContent.authRequests.splice(authRequestIndex, 1)
            break
        case 'sessions':
            const userId = getUserIdFromDb(dbFileContent, email)
            const sessionIndex = dbFileContent.sessions.findIndex((session: ISessionRow) => session.userId === userId)
            dbFileContent.sessions.splice(sessionIndex, 1)
            break
        default:
            return "Incorrect table"
    }

}

export const createNewWishRecord = (dbContent: IWishListDb, userId: UserId, title: string, description: string) => {
    const wishRow: IWishesRow = {
        userId: userId,
        wishId: nanoid(wishIdLength),
        title: title,
        description: description
    }
    dbContent.wishes.push(wishRow)
}

export const createEmptyDbContent = (): IWishListDb => {
    return {
        "rooms": [],
        "users": [],
        "sessions": [],
        "wishes": [],
        "authRequests": []
    }
}