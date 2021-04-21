import express from "express";
import WishListFileDatabase from "../../database/Database";
import {databasePath} from "../../addresses";
import {IWishRow} from "../../database/interfaces";

const getWishesByUserIdHandler = (req: express.Request, res: express.Response) => {
    const userId = req.params.userId
    if (!userId) {
        res.status(401).send("Username doesn't provide")
        return
    }
    const dbInstance = new WishListFileDatabase(databasePath)
    dbInstance.getWishesByUserId(userId)
        .then((data: IWishRow[]) => {
            res.status(200).send(data)
        })
        .catch((err: Error) => {
            console.error(err)
            res.status(500).send(err)
        })
}

export default getWishesByUserIdHandler