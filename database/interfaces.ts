export interface IWishListDb {
    rooms: IRoomRow[],
    users: IUserRow[],
    sessions: ISessionRow[],
    wishes: IWishesRow[],
    authRequests: IAuthRequestRow[]
  }

export interface IRoomRow {
    userId: string
    roomId: string
}

export interface IUserRow {
    userId: string
    email: string
}

export interface IWishesRow {
    userId: string
    wishId: string
    title: string
    description: string
}

export interface ISessionRow {
    userId: string
    cookie: string
}


export interface IAuthRequestRow {
    email: string
    token: string
}
