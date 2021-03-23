import initialiseDB from "./database/initialiseDB";
import authoriseHandler from "./handlers/authoriseHandler/authoriseHandles";
import magicLinkHandler from "./handlers/magicLinkHandler/magicLinkHandler";
import statusHandler from "./handlers/statusHandler/statusHandler"

const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const cors = require('cors');

const app = express()
const port = "3000"

initialiseDB()
.then(data => console.log(data))

app.use(cors({ origin: true, credentials: true }))
app.use(cookieParser())
app.use(bodyParser.urlencoded({
    extended: true
  }))
app.use(bodyParser.json())

app.get('/getstatus', statusHandler)

app.post('/create-magic-link', magicLinkHandler)

app.get('/authorise', authoriseHandler)


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})