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
import createRoomHandler from "./handlers/createRoomHandler/createRoomHandler";
import addUserToRoomHandler from "./handlers/addUserToRoomHandler/addUserToRoomHandler";
import getAllWishesOfLoggedInUserHandler
    from "./handlers/getAllWishesOfLoggedInUserHandler/getAllWishesOfLoggedInUserHandler";
import getWishesByUserIdHandler from "./handlers/getWishesByUserIdHandler/getWishesByUserIdHandler";
import getUsernameByUserIdHandler from "./handlers/getUsernameByUserIdHandler/getUsernameByUserIdHandler";

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

app.get('/getPublicWishes/:username', getPublicWishesHandler)

app.get('/getWishesById/:userId', getWishesByUserIdHandler)

app.get('/getUsernameByUserId/:userId', getUsernameByUserIdHandler)

app.get('/getAllRooms', getAllWishesOfLoggedInUserHandler)

app.post('/createRoom', createRoomHandler)

app.post('/addUserToRoom', addUserToRoomHandler)

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