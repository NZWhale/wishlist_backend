import express from "express";
import WishListFileDatabase from "../../database/Database";
import {databasePath} from "../../addresses";

const addUserToRoomHandler = (req: express.Request, res: express.Response) => {
    const cookie = req.cookies['auth-token']
    if (!cookie) {
        console.log("cookie is not provided")
        res.status(401).send("cookie is not provided")
        return
    }
    const roomId = req.body.roomId
    if (!roomId) {
        console.log("room is not provided", roomId)
        res.status(401).send("room is not provided")
        return
    }
    const email = req.body.email
    if (!email) {
        console.log("email is not provided")
        res.status(401).send("email is not provided")
        return
    }
    const dbInstance = new WishListFileDatabase(databasePath)
    dbInstance.addUserToRoom(cookie, roomId, email)
        .then(() => {
            res.status(200).send('User successful added')
        })
        .catch((err: Error) => {
            res.status(401).send(err)
        })
}

export default addUserToRoomHandler