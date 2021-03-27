export interface IWishListDb {
    rooms: IRoomRow[],
    users: IUserRow[],
    sessions: ISessionRow[],
    wishes: IWishesRow[],
    authRequests: IAuthRequest[]
  }

export interface IRoomRow {
    userId: string
    roomId: string
}

export interface IUserRow {
    userId: string
    email: string
    wishesId: string[] | null
}

export interface IWishesRow {
    wishId: string
    title: string
    description: string
}

export interface ISessionRow {
    userId: string
    cookie: string
}


export interface IAuthRequest {
    email: string
    token: string
}
