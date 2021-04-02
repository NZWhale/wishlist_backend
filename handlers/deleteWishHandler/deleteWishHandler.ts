import express from "express";
import WishListFileDatabase from "../../database/Database";
import {databasePath} from "../../addresses";

const deleteWishHandler = (req: express.Request, res: express.Response) => {
    const wishId = req.body.wishId
    if(!wishId){
        throw new Error("WishId doesn't exist in request")
    }
    const dbInstance = new WishListFileDatabase(databasePath)
    dbInstance.deleteWish(wishId)
        .then(() => {
            res.status(200).send('Wish successfully deleted')
        })
        .catch((err: Error) => {
            res.status(500).send(err)
        })
}

export default deleteWishHandler