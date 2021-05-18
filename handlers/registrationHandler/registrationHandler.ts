import {confirmationUrl, databasePath} from "../../addresses";
import WishListFileDatabase from "../../database/Database";
import sendMagicLink from "../magicLinkHandler/sendMagicLink";

const magicLinkHandler = async (req: any, res: any) => {
    const dbInstance = new WishListFileDatabase(databasePath)
    const email = req.body.email.toLowerCase()
    console.log(email)
    if(!email){
        res.status(500).send('Email or password is not valid')
        return
    }
    const password = req.body.password
    console.log(password)
    if(!password){
        res.status(500).send('Email or password is not valid')
    }
    dbInstance.registrationViaLoginAndPassword(email, password)
        .then((data: string) => {
            sendMagicLink(email, confirmationUrl+data)
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



export default magicLinkHandler