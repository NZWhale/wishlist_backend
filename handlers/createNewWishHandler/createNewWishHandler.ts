import express from "express";
import WishListFileDatabase from "../../database/Database";
import {databasePath} from "../../addresses";

const createNewWishHandler = (req: express.Request, res: express.Response) => {
    const cookie = req.body.cookie
    if(!cookie){
        throw new Error("Cookie doesn't exist")
    }
    const title = req.body.title
    if(!title){
        throw new Error("Title doesn't exist")
    }
    const description = req.body.description
    if(!description){
        throw new Error("Description doesn't exist")
    }
    const dbInstance = new WishListFileDatabase(databasePath)
    dbInstance.addNewWish(cookie, title, description)
        .then(() => {
            res.status(200).send()
        })
        .catch((err: Error) => {
            res.status(500).send(err)
        })
}

export default createNewWishHandler