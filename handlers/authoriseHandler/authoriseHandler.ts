import express from "express"
import {cookieAge, databasePath} from "../../addresses"
import WishListFileDatabase from "../../database/Database";

const authoriseHandler = (req: express.Request, res: express.Response) => {
    const token = req.body.token
    if (typeof (token) !== 'string' || !token) {
        res.status(500).send("Token doesn't exist in the request")
        return
    }

    const dbInstance = new WishListFileDatabase(databasePath)
    dbInstance.authoriseUser(token)
        .then((data: string) => {
            console.log('cookie =', data)
            res.cookie('auth-token', data, {domain: '127.0.0.1', maxAge: cookieAge, httpOnly: false})
            res.status(200).send()
        })
        .catch((err: Error) => {
            res.status(500).send(err)
            console.log(err)
        })
}


export default authoriseHandler