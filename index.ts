import { port } from "./addresses";
import authoriseHandler from "./handlers/authoriseHandler/authoriseHandler";
import magicLinkHandler from "./handlers/magicLinkHandler/magicLinkHandler";
import statusHandler from "./handlers/statusHandler/statusHandler"
import addNewWishHandler from "./handlers/addNewWishHandler/addNewWishHandler";
import modifyWishHandler from "./handlers/modifyWishHandler/modifyWishHandler";
import deleteWishHandler from "./handlers/deleteWishHandler/deleteWishHandler";
import getAllWishesHandler from "./handlers/getWishesHandler/getWishesHandler";
import getPublicWishesHandler from "./handlers/getPublicWishesHandler/getPublicWishesHandler";

const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const cors = require('cors');

const app = express()


app.use(cors({ origin: true, credentials: true }))
app.use(cookieParser())
app.use(bodyParser.urlencoded({
    extended: true
  }))
app.use(bodyParser.json())

app.get('/getstatus', statusHandler)

app.get('/getAllWishes', getAllWishesHandler)

app.get('/getPublicWishes', getPublicWishesHandler)

app.post('/create-magic-link', magicLinkHandler)

app.post('/authorise', authoriseHandler)

app.post('/addNewWish', addNewWishHandler )

app.put('/modifyWish', modifyWishHandler)

app.post('/deleteWish', deleteWishHandler)



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})