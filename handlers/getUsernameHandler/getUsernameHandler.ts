import WishListFileDatabase from "../../database/Database";
import {databasePath} from "../../addresses";
import express from "express";

const getUsernameHandler = (req: express.Request, res: express.Response) => {
    const cookie = req.cookies['auth-token']
    if (!cookie) {
        res.status(500).send("Cookie doesn't exist")
        return
    }
    const dbInstance = new WishListFileDatabase(databasePath)
    dbInstance.getUsernameByCookie(cookie)
        .then((data: string|null) => {
            if(data === null) {
                res.status(500).send("User doesn't have username" )
            }
            res.status(200).send(data)
        })
        .catch((err: Error) => {
            console.error(err)
            res.status(500).send(err)
        })
}

export default getUsernameHandler