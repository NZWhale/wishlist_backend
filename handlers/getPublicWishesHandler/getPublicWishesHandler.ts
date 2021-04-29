import WishListFileDatabase from "../../database/Database";
import {databasePath} from "../../addresses";
import {IWishRow} from "../../database/interfaces";
import express from "express";

const getPublicWishesHandler = (req: express.Request, res: express.Response) => {
    const username = req.params.username
    if (!username) {
        res.status(401).send("Username doesn't provide")
        return
    }
    const dbInstance = new WishListFileDatabase(databasePath)
    dbInstance.getPublicWishesOfUser(username)
        .then((data: IWishRow[]) => {
            res.status(200).send(data)
        })
        .catch((err: Error) => {
            console.error(err)
            res.status(500).send(err)
        })
}

export default getPublicWishesHandler