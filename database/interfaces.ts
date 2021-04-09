export interface IWishListDb {
    rooms: IRoomRow[],
    users: IUserRow[],
    sessions: ISessionRow[],
    wishes: IWishRow[],
    authRequests: IAuthRequestRow[]
  }

export interface IRoomRow {
    userId: string
    roomId: string
}

export interface IUserRow {
    userId: string
    nickname: string | null
    email: string
}

export interface IWishRow {
    userId: string
    wishId: string
    title: string
    description: string
    isPublic: boolean
}

export interface ISessionRow {
    userId: string
    cookie: string
}


export interface IAuthRequestRow {
    email: string
    token: string
}
