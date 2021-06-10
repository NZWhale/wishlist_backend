import { cookieAge, databasePath, domainUrl} from "../../addresses";
import WishListFileDatabase from "../../database/Database";
import express from "express";

const recoveryCodeValidationHandler = async (req: express.Request, res: express.Response) => {
    const recoveryCode = req.body.recoveryCode
    if(typeof (recoveryCode) !== 'string' || !recoveryCode){
        res.status(500).send('Recovery code is not valid')
        return
    }
    const dbInstance = new WishListFileDatabase(databasePath)
    dbInstance.recoveryCodeValidation(recoveryCode)
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