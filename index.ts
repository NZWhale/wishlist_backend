import {domainUrl, port} from "./addresses";
import authoriseViaMagicCodeHandler from "./handlers/authoriseHandler/authoriseViaMagicCodeHandler";
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
import getAllRoomsOfLoggedInUserHandler from "./handlers/getAllRoomsOfLoggedInUserHandler/getAllRoomsOfLoggedInUserHandler";
import getWishesByUserIdHandler from "./handlers/getWishesByUserIdHandler/getWishesByUserIdHandler";
import getUsernameByUserIdHandler from "./handlers/getUsernameByUserIdHandler/getUsernameByUserIdHandler";
import addUserViaLinkHandler from "./handlers/addUserViaLinkHandler/addUserViaLinkHandler";
import registrationHandler from "./handlers/registrationHandler/registrationHandler";
import regularAuthoriseHandler from "./handlers/authoriseHandler/regularAuthoriseHandler";
import emailConfirmationHandler from "./handlers/emailConfirmationHandler/emailConfirmationHandler";
import deleteCookieHandler from "./handlers/deleteCookieHandler/deleteCookieHandler";
import changePasswordHandler from "./handlers/changePasswordHandler/changePasswordHandler";
import recoveryCodeValidationHandler from "./handlers/recoveryCodeValidationHandler/recoveryCodeValidationHandler";
import sendRecoveryLinkHandler from "./handlers/sendRecoveryLinkHandler/sendRecoveryLinkHandler";

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

app.get('/deletecookie', deleteCookieHandler)

app.get('/getAllWishes', getWishesOfLoggedInUserHandler)

app.get('/getPublicWishes/:username', getPublicWishesHandler)

app.get('/getWishesById/:userId', getWishesByUserIdHandler)

app.get('/getUsernameByUserId/:userId', getUsernameByUserIdHandler)

app.get('/getAllRooms', getAllRoomsOfLoggedInUserHandler)

app.post('/changePassword', changePasswordHandler)

app.post('/generateRecoveryLink', sendRecoveryLinkHandler)

app.post('/codeValidationHandler', recoveryCodeValidationHandler)

app.post('/emailConfirmation', emailConfirmationHandler)

app.post('/registration', registrationHandler)

app.post('/authorise', regularAuthoriseHandler)

app.post('/createRoom', createRoomHandler)

app.post('/addUserToRoom', addUserToRoomHandler)

app.post('/addUserViaLink', addUserViaLinkHandler)

app.post('/create-magic-link', magicLinkHandler)

app.post('/authoriseViaMagicCode', authoriseViaMagicCodeHandler)

app.post('/addNewWish', addNewWishHandler )

app.post('/modifyWish', modifyWishHandler)

app.post('/deleteWish', deleteWishHandler)

app.post('/setUsername', setUsernameHandler)

app.get('/getUsername', getUsernameHandler)


app.listen(port, () => {
    console.log(`App listening at http://${domainUrl}:${port}`)
})