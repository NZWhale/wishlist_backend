import express from "express"
import {databasePath} from "../../addresses"
import WishListFileDatabase from "../../database/Database";

const changePasswordHandler = (req: express.Request, res: express.Response) => {
    const cookie = req.cookies['auth-token']
    const oldPassword = req.body.oldPassword
    const newPassword = req.body.newPassword

    if (typeof (cookie) !== 'string' || !cookie) {
        res.status(500).send("Cookie is invalid")
        return
    }

    if (typeof (oldPassword) !== 'string' || !oldPassword) {
        res.status(500).send("Old password isn't exist in request")
        return
    }

    if (typeof (newPassword) !== 'string' || !newPassword) {
        res.status(500).send("New password isn't exist in request")
        return
    }

    const dbInstance = new WishListFileDatabase(databasePath)
    dbInstance.changePassword(cookie, oldPassword, newPassword)
        .then((data: string|null) => {
            console.log(`User: ${data}, changed his password`)
            res.status(200).send()
        })
        .catch((err: Error) => {
            res.status(500).send(err)
            console.log(err)
        })
}


export default changePasswordHandler