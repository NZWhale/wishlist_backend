import { cookieAge, databasePath, domainUrl} from "../../addresses";
import WishListFileDatabase from "../../database/Database";
import express from "express";

const recoveryCodeValidationHandler = async (req: express.Request, res: express.Response) => {
    const cookie = req.cookies['auth-token']
    const recoveryCode = req.body.recoveryCode
    if (typeof (cookie) !== 'string' || !cookie) {
        res.status(500).send("Cookie is invalid")
        return
    }
    if(typeof (recoveryCode) !== 'string' || !recoveryCode){
        res.status(500).send('Email or password is not valid')
        return
    }
    const dbInstance = new WishListFileDatabase(databasePath)
    dbInstance.recoveryCodeValidation(recoveryCode, cookie)
        .then((data: string) => {
            res.cookie('auth-token', data, {domain: domainUrl, maxAge: cookieAge, httpOnly: false})
            res.status(200).send(data)
        })
        .catch((err: Error) => {
            console.error(err)
            res.status(500).send(err)
        })
}



export default recoveryCodeValidationHandler