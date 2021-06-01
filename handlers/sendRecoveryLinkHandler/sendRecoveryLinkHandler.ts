import { databasePath} from "../../addresses";
import WishListFileDatabase from "../../database/Database";
import sendMagicLink from "../magicLinkHandler/sendMagicLink";
import express from "express";

const sendRecoveryLinkHandler = (req: express.Request, res: express.Response) => {
    const email = req.body.email.toLowerCase()
    if(typeof (email) !== 'string' || !email){
        res.status(500).send('Email or password is not valid')
        return
    }
    console.log(email)
    const dbInstance = new WishListFileDatabase(databasePath)
    dbInstance.createRecoveryLink(email)
        .then((data: string) => {
            sendMagicLink(email, data)
                .then(() => {
                    res.status(200).send()
                })
                .catch((err: Error) => {
                    console.error(err)
                    res.status(500).send('Email was not sent')
                })
        })
        .catch((err: Error) => {
            console.error(err)
            res.status(500).send(err)
        })
}



export default sendRecoveryLinkHandler