import express from "express";
import WishListFileDatabase from "../../database/Database";
import {databasePath} from "../../addresses";

const createRoomHandler = (req: express.Request, res: express.Response) => {
    const cookie = req.cookies['auth-token']
    if (!cookie) {
        res.status(401).send("cookie is not provided")
        return
    }
    const roomName = req.body.roomName
    if (!roomName) {
        res.status(401).send("Room name doesn't prodive")
        return
    }
    const dbInstance = new WishListFileDatabase(databasePath)
    dbInstance.createRoom(cookie, roomName)
        .then(() => {
            res.status(200).send('room successful created')
        })
        .catch((err: Error) => {
            res.status(401).send(err)
        })
}

export default createRoomHandler