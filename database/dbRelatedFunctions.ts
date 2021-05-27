import {IAuthRequestRow, ISessionRow, IUserRow, IWishRow, IWishListDb, IRoomRow} from "./interfaces";
import {roomIdLength, wishIdLength} from "../addresses";
import createRandomId from "../createRandomId";

type Email = string
type UserId = string
type WishId = string
type Cookie = string
type MagicId = string
type RoomId = string

export const createAuthRequestRecord = (dbContent: IWishListDb, magicId: MagicId, userEmail: Email) => {
    const authRequestRecord: IAuthRequestRow = {
        token: magicId,
        email: userEmail
    }
    dbContent.authRequests.push(authRequestRecord)
}

export const createUserRecord = (dbContent: IWishListDb, userId: UserId, userEmail: Email, isEmailConfirmed: boolean, password?: string, salt?: string) => {
    const userRecord: IUserRow = {
        userId: userId,
        email: userEmail,
        username: null,
        isEmailConfirmed: isEmailConfirmed,
        password: password?password:null,
        passwordSalt: salt?salt:null
    }
    dbContent.users.push(userRecord)
}

export const setNewPassword = (dbContent: IWishListDb, userId: UserId, hash: string, salt: string) => {
        dbContent.users.forEach((user: IUserRow) => {
            if(user.userId === userId){
                user.password = hash
                user.passwordSalt = salt
            }
        })
}

export const createSessionRecord = (dbContent: IWishListDb, userId: UserId, cookie: Cookie) => {
    if(!isSessionExist(dbContent,userId)){
    const sessionRecord: ISessionRow = {
        userId: userId,
        cookie: [cookie]
    }
    dbContent.sessions.push(sessionRecord)
    }
    addCookieToSessionRow(dbContent, userId, cookie)
}

export const addCookieToSessionRow = (dbContent: IWishListDb, userId: UserId, cookie: Cookie) => {
    dbContent.sessions.forEach((session: ISessionRow) => {
        if(session.userId === userId){
            session.cookie.push(cookie)
        }
    })
}

export const isAuthRequestExist = (dbContent: IWishListDb, email: Email) => {
    const result = dbContent.authRequests.findIndex((authRequest: IAuthRequestRow) => authRequest.email === email)
    return result !== -1
}
export const isAuthRequestExistByToken = (dbContent: IWishListDb, token: string) => {
    const result = dbContent.authRequests.findIndex((authRequest: IAuthRequestRow) => authRequest.token === token)
    return result !== -1
}

export const returnWishIndex = (dbContent: IWishListDb, wishId: WishId) => {
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

export const getUserEmailFromAuthRequests = (dbContent: IWishListDb, token: string): string | null => {
    const result = dbContent.authRequests.find((authRequest: IAuthRequestRow) => authRequest.token === token)
    return result ? result.email : null
}

export const getUserIdFromDb = (dbContent: IWishListDb, email: Email): string | null => {
    const result = dbContent.users.find((user: IUserRow) => user.email === email)
    return result ? result.userId : null
}

export const getUserIdByCookie = (dbContent: IWishListDb, cookie: Cookie): string | null => {
    let result = dbContent.sessions.find((session: ISessionRow) => session.cookie.find((iterativeCookie: string) => cookie === iterativeCookie))
    return result ? result.userId : null
}

export const getUsernameByUserId = (dbContent: IWishListDb, userId: UserId): string | null => {
    const username = dbContent.users.find((user: IUserRow) => user.userId === userId)
    return username ? username.username : null
}

export const getUserIdByEmail = (dbContent: IWishListDb, email: string): string | null => {
    const result = dbContent.users.find((user: IUserRow) => user.email === email)
    return result ? result.userId : null
}
export const getUserIdByUsername = (dbContent: IWishListDb, username: string): string | null => {
    const result = dbContent.users.find((user: IUserRow) => user.username === username)
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

export const isEmailExistInDb = (dbContent: IWishListDb, email: Email): boolean => {
    const isEmailExist = dbContent.users.find(user => user.email === email)
    return !!isEmailExist
}

export const getPublicWishesByUserId = (dbContent: IWishListDb, userId: UserId): IWishRow[] => {
    const publicWishes: IWishRow[] = []
    dbContent.wishes.forEach((wish: IWishRow) => {
        if (wish.userId === userId && wish.isPublic) {
            publicWishes.push(wish)
        }
    })
    return publicWishes
}

export const deleteCookieFromSessionRow = (dbContent: IWishListDb, userId: UserId, cookie: Cookie) => {
    const sessionIndex = dbContent.sessions.findIndex((session: ISessionRow) => {
        if(session.userId === userId){
            session.cookie.findIndex((iterativeCookie: Cookie) => iterativeCookie === cookie)
        }
    })
    dbContent.sessions.splice(sessionIndex, 1)
}

export const deleteAuthRequestFromTable = (dbContent: IWishListDb, email: Email) => {
    const authRequestIndex = dbContent.authRequests.findIndex((authRequest: IAuthRequestRow) => authRequest.email === email)
    dbContent.authRequests.splice(authRequestIndex, 1)
}

export const createNewWishRecord = (dbContent: IWishListDb, userId: UserId, title: string, description: string, isPublic: boolean | string[]) => {
    const wishRow: IWishRow = {
        userId: userId,
        wishId: createRandomId(wishIdLength, title),
        title: title,
        description: description?description:null,
        isPublic: isPublic
    }
    dbContent.wishes.push(wishRow)
}
export const deleteWishRecord = (dbContent: IWishListDb, wishIndex: number) => {
    dbContent.wishes.splice(wishIndex, 1)
}

export const editWishRecord = (dbContent: IWishListDb, wishIndex: number, isPublic: boolean | string[], title?: string, description?: string) => {
    if (title) {
        dbContent.wishes[wishIndex].title = title
    }
    if (description) {
        dbContent.wishes[wishIndex].description = description
    }
    dbContent.wishes[wishIndex].isPublic = isPublic

}

export const setUsername = (dbContent: IWishListDb, userId: UserId, username: string) => {
    dbContent.users.forEach((user: IUserRow) => {
        if (user.userId === userId) {
            user.username = username
            return
        }
    })
}
export const isUsernameBusy = (dbContent: IWishListDb, username: string): boolean => {
    const result = dbContent.users.find((user: IUserRow) => user.username === username)
    return !!result
}

export const setEmailConfirmationStatus = (dbContent: IWishListDb, userEmail: Email, status: boolean) => {
    const userId = getUserIdByEmail(dbContent, userEmail)
    dbContent.users.forEach((user: IUserRow) => {
        if (user.userId === userId) {
            user.isEmailConfirmed = status
            return
        }
    })
}

export const getUserDataByUserId = (dbContent: IWishListDb, userId: UserId): IUserRow | null => {
    const user = dbContent.users.find((user: IUserRow) => user.userId === userId)
    return user ? user : null
}

export const getRoomIdByRoomName = (dbContent: IWishListDb, roomName: string): string | null => {
    const room = dbContent.rooms.find((room: IRoomRow) => room.roomName === roomName)
    return room ? room.roomId : null
}

export const getWishIdByWishName = (dbContent: IWishListDb, title: string): string | null => {
    const wish = dbContent.wishes.find((wish: IWishRow) => wish.title === title)
    return wish ? wish.wishId : null
}

export const createNewRoom = (dbContent: IWishListDb, userId: UserId, roomName: string) => {
    const user = getUserDataByUserId(dbContent, userId)
    if (!user) {
        throw new Error("User doesn't exist")
    }
    const roomRow: IRoomRow = {
        creatorId: userId,
        roomId: createRandomId(roomIdLength, roomName),
        roomName: roomName,
        users: []
    }
    roomRow.users.push(user.userId)
    dbContent.rooms.push(roomRow)
}

export const addUserToRoom = (dbContent: IWishListDb, roomId: RoomId, addableUserId: UserId) => {
    const user = getUserDataByUserId(dbContent, addableUserId)
    if (!user) {
        throw new Error("User doesn't exist")
    }
    const isUserExist = dbContent.rooms.find((room: IRoomRow) => {
        if(room.roomId === roomId){
            return room.users.find((user: string) => user === addableUserId)
        }
    })
    if(isUserExist){
        throw new Error('User already in the room')
    }
    dbContent.rooms.forEach((room: IRoomRow) => {
        if (room.roomId === roomId) {
            room.users.push(user.userId)
        }
    })

}

export const getAllRoomsOfUser = (dbContent: IWishListDb, userId: UserId): IRoomRow[] => {
    const allRoomsOfUser: IRoomRow[] = []
    dbContent.rooms.forEach((room: IRoomRow) => {
        room.users.forEach((user: string) => {
            if(user === userId){
                allRoomsOfUser.push(room)
            }
            })
        })
    if(allRoomsOfUser.length === 0) {
        throw new Error("User isn't a member of any rooms")
    }
    return allRoomsOfUser
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