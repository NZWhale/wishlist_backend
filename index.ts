const express = require('express')
const bodyParser = require('body-parser');
const fs = require('fs')

const app = express()
const port = "3000"

import statusHandler from "./handlers/statusHandler/statusHandler"


app.use(bodyParser.json({ limit: '10mb', extended: true }))

app.get('/getfriends', statusHandler)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})