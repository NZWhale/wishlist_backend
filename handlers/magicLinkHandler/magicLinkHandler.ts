import createMagicLink from "./createMagicLink"

const magicLinkHandler = (req: any, res: any) => {
        const magicLink = createMagicLink(req.body.email)
        .then(data => data)

}

export default magicLinkHandler