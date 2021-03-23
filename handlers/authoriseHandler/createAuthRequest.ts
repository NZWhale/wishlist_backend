import { nanoid } from "nanoid"
import { IAuthRequest, ISessionRow, IWishListDb } from "../../interfaces"

const fs = require('fs')
const databasePath = './data/WishListDB.json'

const createAuthRequest = async (token: string) => new Promise((resolve, reject) => {
    fs.readFile(databasePath, { encoding: 'utf8' }, (err: Error, data: string) => {
        const wishlistDB: IWishListDb = JSON.parse(data)
        const authRequestIndex = wishlistDB.authRequests.findIndex((authRequest: IAuthRequest) => authRequest.token === token)
        if (authRequestIndex === -1) { return reject(new Error("Token doesn't exist in the authRequest table")) }
        // TODO: We need to validate the token when it expires
        const userEmail = wishlistDB.authRequests[authRequestIndex].email
        const userIndex = wishlistDB.users.findIndex(user => user.email === userEmail)
        if (userIndex === -1) { return reject(new Error("User doesn't exist")) }
        const userId = wishlistDB.users[userIndex].user_id
        const sessionIndex = wishlistDB.sessions.findIndex((session: ISessionRow) => session.user_id === userId)
        if (sessionIndex === -1) {
            const newSession: ISessionRow = {
                user_id: userId,
                cookie: nanoid()
            }
            wishlistDB.sessions.push(newSession)
            wishlistDB.authRequests.splice(authRequestIndex, 1)
            fs.writeFile(databasePath, JSON.stringify(wishlistDB), (err: Error) => {
                if (err) { return reject(err) }
                console.log("Data have been saved")
            })
            return resolve(newSession)
        }
        wishlistDB.sessions.splice(sessionIndex, 1)
        const newSession: ISessionRow = {
            user_id: userId,
            cookie: nanoid()
        }
        wishlistDB.sessions.push(newSession)
        wishlistDB.authRequests.splice(authRequestIndex, 1)
        fs.writeFile(databasePath, JSON.stringify(wishlistDB), (err: Error) => {
            if (err) { throw err }
            console.log("Data have been saved")
        })
        return resolve(newSession)

    })
})

export default createAuthRequest