import express from "express";
import WishListFileDatabase from "../../database/Database";
import {databasePath} from "../../addresses";

const modifyWishHandler = (req: express.Request, res: express.Response) => {
    const wishId = req.body.wishId
    console.log(req.body)
    if(!wishId){
        throw new Error("WishId doesn't exist")
    }
    const title = req.body.title
    const description = req.body.description
    const isPublic = req.body.isPublic
    const dbInstance = new WishListFileDatabase(databasePath)
    dbInstance.editWish(wishId, title, description, isPublic)
        .then(() => {
            console.log('Wish successfully edited')
            res.status(200).send('Wish successfully edited')
        })
        .catch((err: Error) => {
            console.error(err)
            res.status(500).send(err)
        })
}

export default modifyWishHandler