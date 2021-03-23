import initialiseDB from "./database/initialiseDB";
import magicLinkHandler from "./handlers/magicLinkHandler/magicLinkHandler";
import statusHandler from "./handlers/statusHandler/statusHandler"

const express = require('express')
const bodyParser = require('body-parser');
const fs = require('fs')

const app = express()
const port = "3000"

initialiseDB()
.then(data => console.log(data))

app.use(bodyParser.urlencoded({
    extended: true
  }))
app.use(bodyParser.json())

app.get('/getstatus', statusHandler)

app.post('/create-magic-link', magicLinkHandler)


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})