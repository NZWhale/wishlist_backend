import { nanoid } from "nanoid"
import { deleteContentFromDb, getUserEmailFromDb, getUserIdFromDb, isAuthRequestExist, isSessionExist, isUserExist } from "../../database/dbRelatedFunctions"
import { ISessionRow, IWishListDb } from "../../interfaces"

const fs = require('fs')
const databasePath = './data/WishListDB.json'

const authoriseUserByToken = async (token: string): Promise<string> => new Promise((resolve, reject) => {
    fs.readFile(databasePath, { encoding: 'utf8' }, (err: Error, data: string) => {
        const wishlistDB: IWishListDb = JSON.parse(data)
        if (!isAuthRequestExist(wishlistDB, token)) { return reject(new Error("Token doesn't exist in the authRequest table")) }
        // TODO: We need to validate the token when it expires
        const userEmail = getUserEmailFromDb(wishlistDB, token)
        if (!isUserExist(wishlistDB, userEmail)) { return reject(new Error("User doesn't exist")) }
        const userId = getUserIdFromDb(wishlistDB, userEmail)
        if (!isSessionExist(wishlistDB, userId)) {
            const newSession: ISessionRow = {
                user_id: userId,
                cookie: nanoid()
            }
            wishlistDB.sessions.push(newSession)
            deleteContentFromDb(wishlistDB, 'authRequests', userEmail)
            fs.writeFile(databasePath, JSON.stringify(wishlistDB), (err: Error) => {
                if (err) { return reject(err) }
                console.log("Data have been saved")
            })
            return resolve(newSession.cookie)
        }
        deleteContentFromDb(wishlistDB, 'sessions', userEmail)
        const newSession: ISessionRow = {
            user_id: userId,
            cookie: nanoid()
        }
        wishlistDB.sessions.push(newSession)
        deleteContentFromDb(wishlistDB, 'authRequests', userEmail)
        fs.writeFile(databasePath, JSON.stringify(wishlistDB), (err: Error) => {
            if (err) { throw err }
            console.log("Data have been saved")
        })
        return resolve(newSession.cookie)

    })
})

export default authoriseUserByToken