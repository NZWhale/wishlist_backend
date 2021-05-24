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
    users: string[]
}

export interface IUserRow {
    userId: string
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
}

export interface ISessionRow {
    userId: string
    cookie: string[]
}


export interface IAuthRequestRow {
    email: string
    token: string | null
}
