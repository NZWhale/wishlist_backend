import express from "express"
import {cookieAge, databasePath, domainUrl} from "../../addresses"
import WishListFileDatabase from "../../database/Database";

const emailConfirmationHandler = (req: express.Request, res: express.Response) => {
    const confirmationCode = req.body.confirmationCode
    console.log(confirmationCode)
    if (!confirmationCode) {
        res.status(500).send("Token doesn't exist in the request")
        return
    }
    const dbInstance = new WishListFileDatabase(databasePath)
    dbInstance.emailConfirmation(confirmationCode)
        .then((data: string) => {
            res.cookie('auth-token', data, {domain: domainUrl, maxAge: cookieAge, httpOnly: false})
            res.status(200).send('Email confirm successfully')
        })
        .catch((err: Error) => {
            console.error(err)
            res.status(500).send(err)
        })
}


export default emailConfirmationHandler