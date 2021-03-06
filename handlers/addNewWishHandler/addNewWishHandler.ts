import express from "express";
import WishListFileDatabase from "../../database/Database";
import {databasePath} from "../../addresses";

const addNewWishHandler = (req: express.Request, res: express.Response) => {
    const cookie = req.cookies['auth-token']
    if(!cookie){
        res.status(401).send("cookie is not provided")
        return
    }
    const title = req.body.title
    if(!title){
        res.status(401).send("Title doesn't provide")
        return
    }
    const description = req.body.description
    let isPublic = req.body.isPublic
    const dbInstance = new WishListFileDatabase(databasePath)
    dbInstance.addNewWish(cookie, title, description, isPublic)
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