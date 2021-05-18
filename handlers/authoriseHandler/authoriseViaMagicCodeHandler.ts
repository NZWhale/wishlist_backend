import express from "express"
import {cookieAge, databasePath, domainUrl} from "../../addresses"
import WishListFileDatabase from "../../database/Database";

const authoriseViaMagicCodeHandler = (req: express.Request, res: express.Response) => {
    const token = req.body.token
    if (typeof (token) !== 'string' || !token) {
        res.status(500).send("Token doesn't exist in the request")
        return
    }

    const dbInstance = new WishListFileDatabase(databasePath)
    dbInstance.authoriseUserViaToken(token)
        .then((data: string) => {
            res.cookie('auth-token', data, {domain: domainUrl, maxAge: cookieAge, httpOnly: false})
            res.status(200).send()
        })
        .catch((err: Error) => {
            console.error(err)
            res.status(500).send(err)
        })
}


export default authoriseViaMagicCodeHandler