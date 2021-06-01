import express from "express"
import {databasePath} from "../../addresses"
import WishListFileDatabase from "../../database/Database";

const setNewPasswordHandler = (req: express.Request, res: express.Response) => {
    const cookie = req.cookies['auth-token']
    const newPassword = req.body.newPassword

    if (typeof (cookie) !== 'string' || !cookie) {
        res.status(500).send("Cookie is invalid")
        return
    }

    if (typeof (newPassword) !== 'string' || !newPassword) {
        res.status(500).send("New password isn't exist in request")
        return
    }

    const dbInstance = new WishListFileDatabase(databasePath)
    dbInstance.setNewPassword(cookie, newPassword)
        .then((data: string|null) => {
            console.log(`User: ${data}, changed his password`)
            res.status(200).send()
        })
        .catch((err: Error) => {
            res.status(500).send(err)
            console.log(err)
        })
}


export default setNewPasswordHandler