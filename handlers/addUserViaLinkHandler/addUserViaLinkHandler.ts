import express from "express";
import WishListFileDatabase from "../../database/Database";
import {databasePath} from "../../addresses";

const addUserViaLinkHandler = (req: express.Request, res: express.Response) => {
    const cookie = req.cookies['auth-token']
    if(!cookie){
        res.status(401).send("cookie is not provided")
        return
    }
    const roomId = req.body.roomId
    if(!roomId) {
        res.status(401).send("room is not provided")
        return
    }

    const dbInstance = new WishListFileDatabase(databasePath)
    dbInstance.addUserToRoomViaLink(cookie, roomId)
        .then(() => {
            console.log('User added successfully')
            res.status(200).send('User added successfully')
        })
        .catch((err: Error) => {
            console.error(err)
            res.status(500).send(err)
        })
}

export default addUserViaLinkHandler