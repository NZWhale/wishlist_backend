import sendMagicLink, {ISuccess} from "./sendMagicLink"
import createMagicId from "./createMagicId";
import {databasePath} from "../../addresses";
import WishListFileDatabase from "../../database/Database";

const magicLinkHandler = async (req: any, res: any) => {
    const email = req.body.email.toLowerCase()
    const dbInstance = new WishListFileDatabase(databasePath)
    createMagicId(dbInstance, email)
        .then((data: string) => {
                sendMagicLink(email, data)
                .then((data: ISuccess) => {
                        console.log(data)
                        res.status(200).send()
                })
                    .catch((err: Error) => {
                            console.log(err)
                            res.status(500).send('Email was not sent')
                    })
        })
        .catch((err: Error) => {
                console.log(err)
                res.status(500).send(err)
        })
}



export default magicLinkHandler