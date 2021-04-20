import {IAuthRequestRow, ISessionRow, IUserRow, IWishRow, IWishListDb, IRoomRow} from "./interfaces";
import {roomIdLength, wishIdLength} from "../addresses";
import createRandomId from "../createRandomId";

type Email = string
type UserId = string
type WishId = string
type Cookie = string
type MagicId = string
type RoomId = string
type Table = 'authRequests' | 'sessions'

export const createAuthRequestRecord = (dbContent: IWishListDb, magicId: MagicId, userEmail: Email) => {
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
        username: null
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

export const getUsernameByUserId = (dbContent: IWishListDb, userId: UserId): string | null => {
    const username = dbContent.users.find((user: IUserRow) => user.userId === userId)
    return username ? username.username : null
}

export const getUserIdByEmail = (dbContent: IWishListDb, email: string) => {
    const result = dbContent.users.find((user: IUserRow) => user.email === email)
    return result ? result.userId : null
}
export const getUserIdByUsername = (dbContent: IWishListDb, username: string) => {
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
        wishId: createRandomId(wishIdLength, title),
        title: title,
        description: description,
        isPublic: isPublic
    }
    dbContent.wishes.push(wishRow)
}
export const deleteWishRecord = (dbContent: IWishListDb, wishIndex: number) => {
    dbContent.wishes.splice(wishIndex, 1)
}

export const editWishRecord = (dbContent: IWishListDb, wishIndex: number, isPublic: boolean, title?: string, description?: string) => {
    if (title) {
        dbContent.wishes[wishIndex].title = title
    }
    if (description) {
        dbContent.wishes[wishIndex].description = description
    }
    dbContent.wishes[wishIndex].isPublic = isPublic

}

export const setUsername = (dbContent: IWishListDb, userId: UserId, nickname: string) => {
    dbContent.users.forEach((user: IUserRow) => {
        if (user.userId === userId) {
            user.username = nickname
            return
        }
    })
}

export const getUserDataByUserId = (dbContent: IWishListDb, userId: UserId) => {
    const user = dbContent.users.find((user: IUserRow) => user.userId === userId)
    return user ? user : undefined
}

export const getRoomIdByRoomName = (dbContent: IWishListDb, roomName: string) => {
    const room = dbContent.rooms.find((room: IRoomRow) => room.roomName === roomName)
    return room ? room.roomId : undefined
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

export const addUserToRoomTable = (dbContent: IWishListDb, roomId: RoomId, addableUserId: UserId) => {
    const user = getUserDataByUserId(dbContent, addableUserId)
    if (!user) {
        throw new Error("User doesn't exist")
    }
    dbContent.rooms.forEach((room: IRoomRow) => {
        if (room.roomId === roomId) {
            room.users.push(user.userId)
        }
    })

}

export const getRoomIdByCreaterId = (dbContent: IWishListDb, roomCreatorId: UserId) => {
    const room = dbContent.rooms.find((room: IRoomRow) => room.creatorId === roomCreatorId)
    return room ? room.roomId : undefined
}

export const getAllRoomsOfUser = (dbContent: IWishListDb, userId: UserId) => {
    const allRoomsOfUser: IRoomRow[] = []
    dbContent.rooms.forEach((room: IRoomRow) => {
        room.users.forEach((user: string) => {
            console.log(user, userId)
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