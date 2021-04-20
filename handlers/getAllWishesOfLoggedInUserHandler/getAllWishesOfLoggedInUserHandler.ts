import WishListFileDatabase from "../../database/Database";
import {databasePath} from "../../addresses";
import {IRoomRow} from "../../database/interfaces";
import express from "express";

const getAllWishesOfLoggedInUserHandler = (req: express.Request, res: express.Response) => {
    const cookie = req.cookies['auth-token']
    if (!cookie) {
        res.status(401).send("cookie is not provided")
        return
    }
    const dbInstance = new WishListFileDatabase(databasePath)
    dbInstance.getRoomsOfLoggedInUser(cookie)
        .then((data: IRoomRow[]) => {
            console.log(data)
            res.status(200).send(data)
        })
        .catch((err: Error) => {
            console.error(err)
            res.status(500).send(err)
        })
}

export default getAllWishesOfLoggedInUserHandler