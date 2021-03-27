import sendMagicLink from "./sendMagicLink"
import emailIsValid from "./emailIsValid";
import {magicLinkUrl} from "../../addresses";

const magicLinkHandler = async (req: any, res: any) => {
        emailIsValid(req.body.email)
        .then((data: string) => {
                sendMagicLink(req.body.email, magicLinkUrl+data)
                .then(data => {
                        console.log(data)
                        res.status(200).send()
                })
                // console.log(data)
        })
        .catch((err: Error) => {
                console.log(err)
                res.status(500).send(err)
        })
}



export default magicLinkHandler