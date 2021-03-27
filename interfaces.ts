export interface IWishListDb {
    rooms: IRoomRow[],
    users: IUserRow[],
    sessions: ISessionRow[],
    wishes: IWishesRow[],
    authRequests: IAuthRequest[]
  }

export interface IRoomRow {
    user_id: string
    room_id: string
}

export interface IUserRow {
    user_id: string
    email: string
    wishes_id: string[] | null
}

export interface IWishesRow {
    wish_id: string
    title: string
    description: string
}

export interface ISessionRow {
    user_id: string
    cookie: string
}


export interface IAuthRequest {
    email: string
    token: string
}
