import express from "express"
import {cookieAge, databasePath, domainUrl} from "../../addresses"
import WishListFileDatabase from "../../database/Database";

const regularAuthoriseHandler = (req: express.Request, res: express.Response) => {
    const email = req.body.email
    const password = req.body.password
    if (typeof (email) !== 'string' || !email) {
        res.status(500).send("email doesn't exist in the request")
        return
    }

    if (typeof (password) !== 'string' || !password) {
        res.status(500).send("password doesn't exist in the request")
        return
    }

    const dbInstance = new WishListFileDatabase(databasePath)
    dbInstance.authoriseUserByLoginAndPassword(email, password)
        .then((data: string) => {
            console.log(`User: ${email}, has logged in`)
            res.cookie('auth-token', data, {domain: domainUrl, maxAge: cookieAge, httpOnly: false})
            res.status(200).send()
        })
        .catch((err: Error) => {
            res.status(500).send(err)
            console.log(err)
        })
}


export default regularAuthoriseHandler