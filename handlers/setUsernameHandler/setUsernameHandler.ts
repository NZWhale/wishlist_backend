import express from "express";
import WishListFileDatabase from "../../database/Database";
import {databasePath} from "../../addresses";

const setUsernameHandler = (req: express.Request, res: express.Response) => {
    const cookie = req.cookies['auth-token']
    if (!cookie) {
        res.status(500).send("Cookie doesn't exist")
        return
    }
    const username = req.body.username
    if(!username){
        throw new Error("Username doesn't exist")
    }
    const dbInstance = new WishListFileDatabase(databasePath)
    dbInstance.setUsername(cookie, username)
        .then(() => {
            console.log('Username successfully set')
            res.status(200).send('Username successfully set')
        })
        .catch((err: Error) => {
            console.error(err)
            res.status(500).send(err)
        })
}

export default setUsernameHandler