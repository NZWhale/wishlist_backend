import express from "express"
import generateHelloMessage from "./generateHelloMessage"

const statusHandler = (req: express.Request, res: express.Response) => {
    res.status(200).send(generateHelloMessage())
}

export default statusHandler