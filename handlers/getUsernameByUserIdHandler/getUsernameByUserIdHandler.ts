import WishListFileDatabase from "../../database/Database";
import {databasePath} from "../../addresses";
import express from "express";

const getUsernameByUserIdHandler = (req: express.Request, res: express.Response) => {
    const userId = req.params.userId
    if (!userId) {
        res.status(500).send("UserId doesn't exist")
        return
    }
    const dbInstance = new WishListFileDatabase(databasePath)
    dbInstance.getUsernameByUserId(userId)
        .then((data: string|null) => {
            console.log(data)
            if(data === null) {
                res.status(500).send("User doesn't have username" )
                return
            }
            res.status(200).send(data)
        })
        .catch((err: Error) => {
            console.error(err)
            res.status(500).send(err)
        })
}

export default getUsernameByUserIdHandler