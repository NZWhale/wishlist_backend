import WishListFileDatabase from "../../database/Database";
import {databasePath} from "../../addresses";
import express from "express";

const deleteCookieHandler = (req: express.Request, res: express.Response) => {
    const cookie = req.cookies['auth-token']
    if (!cookie) {
        res.status(500).send("Cookie doesn't exist")
        return
    }
    const dbInstance = new WishListFileDatabase(databasePath)
    dbInstance.deleteCookie(cookie)
        .then(() => {
            res.status(200).send('User successfully logout')
        })
        .catch((err: Error) => {
            console.error(err)
            res.status(500).send(err)
        })
}

export default deleteCookieHandler