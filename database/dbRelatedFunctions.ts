import { IAuthRequestRow, ISessionRow, IUserRow, IWishListDb} from "./interfaces";

type Email = string
type UserId = string

export const createAuthRequestRecord = (dbContent: IWishListDb, magicId: string, userEmail: Email) => {
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

export const isAuthRequestExist = (dbFileContent: IWishListDb, token: string) => {
    const result = dbFileContent.authRequests.findIndex((authRequest: IAuthRequestRow) => authRequest.token === token)
    return result !== -1
}

export const isUserExist = (dbFileContent: IWishListDb, email: string) => {
    const result = dbFileContent.users.findIndex(user => user.email === email)
    return result !== -1
}

export const isSessionExist = (dbFileContent: IWishListDb, userId: string) => {
    const result = dbFileContent.sessions.findIndex((session: ISessionRow) => session.userId === userId)
    return result !== -1
}

export const getUserEmailFromDb = (dbFileContent: IWishListDb, token: string) => {
    const result = dbFileContent.authRequests.find((authRequest: IAuthRequestRow) => authRequest.token === token)
    return result ? result.email : ""
}

export const getUserIdFromDb = (dbFileContent: IWishListDb, email: string) => {
    const result = dbFileContent.users.find((user: IUserRow) => user.email === email)
    return result ? result.userId : ""
}

export const deleteContentFromDb = (dbFileContent: IWishListDb, table: string, email: string) => {
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
export const createEmptyDbContent = (): IWishListDb => {
    return {
        "rooms": [],
        "users": [],
        "sessions": [],
        "wishes": [],
        "authRequests": []
    }
}