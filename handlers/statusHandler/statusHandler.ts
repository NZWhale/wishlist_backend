import generateHelloMessage from "./generateHelloMessage"

const statusHandler = (req, res) => {
    res.status(200).send(generateHelloMessage())
}

export default statusHandler