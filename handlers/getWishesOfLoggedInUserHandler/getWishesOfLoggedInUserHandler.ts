import express from "express";
import WishListFileDatabase from "../../database/Database";
import {databasePath} from "../../addresses";
import {IWishRow} from "../../database/interfaces";

const getWishesOfLoggedInUserHandler = (req: express.Request, res: express.Response) => {
    const cookie = req.cookies['auth-token']
    if (!cookie) {
        res.status(500).send("Cookie doesn't exist")
        return
    }
    const dbInstance = new WishListFileDatabase(databasePath)
    dbInstance.getAllWishesOfLoggedInUser(cookie)
        .then((data: IWishRow[]) => {
            // console.log(data)
            res.status(200).send(data)
        })
        .catch((err: Error) => {
            console.error(err)
            res.status(500).send(err)
        })
}

export default getWishesOfLoggedInUserHandler