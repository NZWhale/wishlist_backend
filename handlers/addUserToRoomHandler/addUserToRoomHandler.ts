import express from "express";
import WishListFileDatabase from "../../database/Database";
import {databasePath} from "../../addresses";

const addUserToRoomHandler = (req: express.Request, res: express.Response) => {
    const cookie = req.cookies['auth-token']
    console.log(cookie)
    if (!cookie) {
        res.status(401).send("Cookie doesn't provide")
        return
    }
    const userName = req.body.userName
    if (!userName) {
        res.status(401).send("Username doesn't prodive")
        return
    }
    const dbInstance = new WishListFileDatabase(databasePath)
    dbInstance.addUserToRoom(cookie, userName)
        .then(() => {
            res.status(200).send('User successful added')
        })
        .catch((err: Error) => {
            res.status(401).send(err)
        })
}

export default addUserToRoomHandler