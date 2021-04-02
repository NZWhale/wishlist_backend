import express from "express";
import WishListFileDatabase from "../../database/Database";
import {databasePath} from "../../addresses";

const addNewWishHandler = (req: express.Request, res: express.Response) => {
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
            console.log('Wish added successfully')
            res.status(200).send('Wish added successfully')
        })
        .catch((err: Error) => {
            console.error(err)
            res.status(500).send(err)
        })
}

export default addNewWishHandler