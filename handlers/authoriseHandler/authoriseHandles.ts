import express from "express"
import { nanoid } from "nanoid"
import { cookieAge } from "../../addresses"
import { ISessionRow, IWishListDb } from "../../interfaces"
import createAuthRequest from "./authoriseUserByToken"

const authoriseHandler = (req: express.Request, res: express.Response) => {
    const token = req.query.token
    if(typeof(token) !== 'string' ) throw new Error("Token doesn't exist in the request")
    createAuthRequest(token)
    .then((data: any) => {
        console.log(data)
        res.cookie('auth-token', data.cookie, { domain: '127.0.0.1', maxAge: cookieAge, httpOnly: false })
        res.status(200).send()
    })
    .catch((err: Error) => console.log(err))
}



export default authoriseHandler