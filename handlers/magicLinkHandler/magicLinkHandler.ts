import createMagicLink from "./emailIsValid"
import sendMagicLink from "./sendMagicLink"

const magicLinkHandler = (req: any, res: any) => {
        const magicLink = createMagicLink(req.body.email)
        .then((data: string) => {
                sendMagicLink(req.body.email, data)
                .then(data => {
                        console.log(data)
                        console.log(magicLink)
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