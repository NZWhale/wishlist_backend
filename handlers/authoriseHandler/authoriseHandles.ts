import { nanoid } from "nanoid"
import { ISessionRow, IWishListDb } from "../../interfaces"
import createAuthRequest from "./createAuthRequest"

const fs = require('fs')
const databasePath = './data/WishListDB.json'

const authoriseHandler = (req: any, res: any) => {
    const token = req.query.token
    if(!token) throw new Error("Token doesn't exist in the request")
    createAuthRequest(token)
    .then((data: any) => {
        console.log(data)
        const cookieAge = 24 * 60 * 60 * 1000 * 100
        res.cookie('auth-token', data.cookie, { domain: '127.0.0.1', maxAge: cookieAge, httpOnly: false })
        res.status(200).send()
    })
}



export default authoriseHandler