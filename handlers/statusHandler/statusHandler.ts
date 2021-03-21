import generateHelloMessage from "./generateHelloMessage"

const statusHandler = (req: any, res: any) => {
    res.status(200).send(generateHelloMessage())
}

export default statusHandler