export interface IWishListDb {
    rooms: IRoomRow[],
    users: IUserRow[],
    sessions: ISessionRow[],
    wishes: IWishRow[],
    authRequests: IAuthRequestRow[]
  }

export interface IRoomRow {
    creatorId: string
    roomId: string
    roomName: string
    roomUsers: IWishesPage[]
}

interface IWishesPage {
    userId: string,
    userPageId: string,
    viewedBySinceLastUpdate: UserId[]
}

type UserId = string
export interface IUserRow {
    userId: UserId
    username: string | null
    email: string
    isEmailConfirmed: boolean
    password: string | null
    passwordSalt: string | null
}

export interface IWishRow {
    userId: string
    wishId: string
    title: string
    description: string | null
    isPublic: boolean | string[]
    updatedAt: string
}

export interface ISessionRow {
    userId: string
    cookie: string[]
}

export interface IAuthRequestRow {
    email: string
    token: string | null
}
