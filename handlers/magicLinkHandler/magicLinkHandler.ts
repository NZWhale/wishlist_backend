import sendMagicLink, {ISuccess} from "./sendMagicLink"
import createMagicId from "./createMagicId";
import {magicLinkUrl} from "../../addresses";

const magicLinkHandler = async (req: any, res: any) => {
    const email = req.body.email.toLowerCase()
    createMagicId(email)
        .then((data: string) => {
                sendMagicLink(email, magicLinkUrl+data)
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