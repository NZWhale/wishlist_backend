import createMagicLink from "./createMagicLink"
import sendMagicLink from "./sendMagicLink"

const magicLinkHandler = (req: any, res: any) => {
        const magicLink = createMagicLink(req.body.email)
        .then((data) => {
                sendMagicLink(req.body.email, data)
                console.log(data)
        })
        .catch(err => console.log(err))
        console.log(magicLink)

}



export default magicLinkHandler