import express from "express";
import WishListFileDatabase from "../../database/Database";
import {databasePath} from "../../addresses";

const deleteWishHandler = (req: express.Request, res: express.Response) => {
    const wishId = req.body.wishId
    const cookie = req.cookies['auth-token']
    if(!cookie){
        res.status(401).send("cookie is not provided")
        return
    }
    if(!wishId){
        res.status(500).send("WishId doesn't exist in request")
        return
    }
    const dbInstance = new WishListFileDatabase(databasePath)
    dbInstance.deleteWish(wishId, cookie)
        .then(() => {
            console.log('Wish successfully deleted')
            res.status(200).send('Wish successfully deleted')
        })
        .catch((err: Error) => {
            console.error(err)
            res.status(500).send(err)
        })
}

export default deleteWishHandler