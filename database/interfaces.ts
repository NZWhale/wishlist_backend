export interface IWishListDb {
    rooms: IRoomRow[],
    users: IUserRow[],
    sessions: ISessionRow[],
    wishes: IWishRow[],
    authRequests: IAuthRequestRow[],
    recoveryCodes: IRecoveryCodeRow[]
  }

export interface IRecoveryCodeRow {
    userId: string,
    recoveryCode: string
}

export interface IRoomRow {
    creatorId: string
    roomId: string
    roomName: string
    //TODO: later, when you realise update indicator, here should be array of IWishesPage
    users: string[]
}

interface IWishesPage {
    userId: string,
    userPageId: string,
    viewedBySinceLastUpdate: UserId[]
}

type UserId = string

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
