import { port } from "./addresses";
import authoriseHandler from "./handlers/authoriseHandler/authoriseHandler";
import magicLinkHandler from "./handlers/magicLinkHandler/magicLinkHandler";
import statusHandler from "./handlers/statusHandler/statusHandler"
import addNewWishHandler from "./handlers/addNewWishHandler/addNewWishHandler";
import modifyWishHandler from "./handlers/modifyWishHandler/modifyWishHandler";
import deleteWishHandler from "./handlers/deleteWishHandler/deleteWishHandler";
import getPublicWishesHandler from "./handlers/getPublicWishesHandler/getPublicWishesHandler";
import getWishesOfLoggedInUserHandler from "./handlers/getWishesOfLoggedInUserHandler/getWishesOfLoggedInUserHandler";
import setUsernameHandler from "./handlers/setUsernameHandler/setUsernameHandler";
import getUsernameHandler from "./handlers/getUsernameHandler/getUsernameHandler";

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

app.get('/getAllWishes', getWishesOfLoggedInUserHandler)

app.get('/getPublicWishes/:nickname', getPublicWishesHandler)

app.post('/create-magic-link', magicLinkHandler)

app.post('/authorise', authoriseHandler)

app.post('/addNewWish', addNewWishHandler )

app.post('/modifyWish', modifyWishHandler)

app.post('/deleteWish', deleteWishHandler)

app.post('/setUsername', setUsernameHandler)

app.get('/getUsername', getUsernameHandler)


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})