import WishListFileDatabase from "../../database/Database";
import {databasePath} from "../../addresses";
import {IWishRow} from "../../database/interfaces";
import express from "express";

const getPublicWishesHandler = (req: express.Request, res: express.Response) => {
    const nickname = req.params.username
    if (!nickname) {
        res.status(401).send("Username doesn't provide")
        return
    }
    const dbInstance = new WishListFileDatabase(databasePath)
    dbInstance.getPublicWishesOfUser(nickname)
        .then((data: IWishRow[]) => {
            console.log(data)
            res.status(200).send(data)
        })
        .catch((err: Error) => {
            console.error(err)
            res.status(500).send(err)
        })
}

export default getPublicWishesHandler