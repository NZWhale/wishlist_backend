import { port } from "./addresses";
import initialiseDB from "./database/initialiseDB";
import authoriseHandler from "./handlers/authoriseHandler/authoriseHandler";
import magicLinkHandler from "./handlers/magicLinkHandler/magicLinkHandler";
import statusHandler from "./handlers/statusHandler/statusHandler"
import { IWishListDb } from "./interfaces";

const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const cors = require('cors');

const app = express()


initialiseDB()
.then((data: IWishListDb) => console.log(data))
.catch((err: Error) => console.log(err))

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