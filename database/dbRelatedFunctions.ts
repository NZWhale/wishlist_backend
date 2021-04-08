import {IAuthRequestRow, ISessionRow, IUserRow, IWishRow, IWishListDb} from "./interfaces";
import {nanoid} from "nanoid";
import {wishIdLength} from "../addresses";

type Email = string
type UserId = string
type WishId = string
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
        email: userEmail,
        nickname: null
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

export const isAuthRequestExist = (dbContent: IWishListDb, email: Email) => {
    const result = dbContent.authRequests.findIndex((authRequest: IAuthRequestRow) => authRequest.email === email)
    return result !== -1
}
export const isAuthRequestExistByToken = (dbContent: IWishListDb, token: string) => {
    const result = dbContent.authRequests.findIndex((authRequest: IAuthRequestRow) => authRequest.token === token)
    return result !== -1
}

export const isWishExist = (dbContent: IWishListDb, wishId: WishId) => {
    const result = dbContent.wishes.findIndex((wishRow: IWishRow) => wishRow.wishId === wishId)
    if (result === -1) {
        return false
    }
    return result
}

export const isUserExist = (dbContent: IWishListDb, email: Email) => {
    const result = dbContent.users.findIndex(user => user.email === email)
    return result !== -1
}

export const isSessionExist = (dbContent: IWishListDb, userId: UserId) => {
    const result = dbContent.sessions.findIndex((session: ISessionRow) => session.userId === userId)
    return result !== -1
}

export const getUserEmailFromAuthRequests = (dbContent: IWishListDb, token: string) => {
    const result = dbContent.authRequests.find((authRequest: IAuthRequestRow) => authRequest.token === token)
    return result ? result.email : ""
}

export const getUserIdFromDb = (dbContent: IWishListDb, email: Email) => {
    const result = dbContent.users.find((user: IUserRow) => user.email === email)
    return result ? result.userId : ""
}

export const getUserIdByCookie = (dbContent: IWishListDb, cookie: Cookie) => {
    const result = dbContent.sessions.find((session: ISessionRow) => session.cookie === cookie)
    return result ? result.userId : ""
}

export const getUsernameByUserId = (dbContent: IWishListDb, userId: UserId): string|null => {
    const username = dbContent.users.find((user: IUserRow) => user.userId === userId)
    return username ? username.nickname : ""
}

export const getUserIdByNickname = (dbContent: IWishListDb, nickname: string) => {
    const result = dbContent.users.find((user: IUserRow) => user.nickname === nickname)
    return result ? result.userId : null
}

export const getUserData = (dbContent: IWishListDb, email: Email) => {
    return dbContent.users.find((user: IUserRow) => user.email === email)
}

export const getAllWishesOfLoggedInUser = (dbContent: IWishListDb, userId: UserId): IWishRow[] => {
    const allWishesOfUser: IWishRow[] = []
    dbContent.wishes.forEach((wish: IWishRow) => {
        if (wish.userId === userId) {
            allWishesOfUser.push(wish)
        }
    })
    return allWishesOfUser
}

export const getPublicWishesByUserId = (dbContent: IWishListDb, userId: string): IWishRow[] => {
    const publicWishes: IWishRow[] = []
    dbContent.wishes.forEach((wish: IWishRow) => {
        if (wish.userId === userId && wish.isPublic) {
            publicWishes.push(wish)
        }
    })
    return publicWishes
}

export const deleteContentFromDb = (dbContent: IWishListDb, table: Table, email: Email) => {
    //TODO: create separate functions for each deleting content
    switch (table) {
        case 'authRequests':
            const authRequestIndex = dbContent.authRequests.findIndex((authRequest: IAuthRequestRow) => authRequest.email === email)
            dbContent.authRequests.splice(authRequestIndex, 1)
            break
        case 'sessions':
            const userId = getUserIdFromDb(dbContent, email)
            const sessionIndex = dbContent.sessions.findIndex((session: ISessionRow) => session.userId === userId)
            dbContent.sessions.splice(sessionIndex, 1)
            break
        default:
            return "Incorrect table"
    }

}

export const createNewWishRecord = (dbContent: IWishListDb, userId: UserId, title: string, description: string, isPublic: boolean) => {
    const wishRow: IWishRow = {
        userId: userId,
        wishId: nanoid(wishIdLength),
        title: title,
        description: description,
        isPublic: isPublic
    }
    dbContent.wishes.push(wishRow)
}
export const deleteWishRecord = (dbContent: IWishListDb, wishIndex: number) => {
    dbContent.wishes.splice(wishIndex, 1)
}

export const editWishRecord = (dbContent: IWishListDb, wishIndex: number, title?: string, description?: string, isPublic?: boolean) => {
    if (title) {
        dbContent.wishes[wishIndex].title = title
    }
    if (description) {
        dbContent.wishes[wishIndex].description = description
    }
    if (isPublic) {
        dbContent.wishes[wishIndex].isPublic = isPublic
    }
}

export const setUsername = (dbContent: IWishListDb, userId: UserId, nickname: string) => {
    dbContent.users.forEach((user: IUserRow) => {
        if (user.userId === userId) {
            user.nickname = nickname
            return
        }
    })
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