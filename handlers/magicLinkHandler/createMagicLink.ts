import * as EmailValidator from 'email-validator';
import { nanoid } from 'nanoid'
import { magicLinkUrl } from '../../addresses';
import { IAuthRequest, IUserRow, IWishListDb } from '../../interfaces';

const fs = require('fs')
const databasePath = './data/WishListDB.json'

const createMagicLink = async (email: string) => new Promise((resolve, reject) => {
        const validationResult = EmailValidator.validate(email)
        if (!validationResult) {
            return reject(new Error("Email failed validation"))
        }
        fs.readFile(databasePath, { encoding: 'utf8' }, (err: Error, data: string) => {
            if (err) return reject(err)
            const wishListData: IWishListDb = JSON.parse(data)
            const isUserExist = wishListData.users.find((user: IUserRow) => user.email === email)
            if (!isUserExist) {
                const userId = nanoid(10)
                const newUser: IUserRow = {
                    user_id: userId,
                    email: email,
                    wishes_id: null
                }
                wishListData.users.push(newUser)
                const authRequests: IAuthRequest = {
                    email: email,
                    token: nanoid()
                }
                wishListData.authRequests.push(authRequests)
                fs.writeFile(databasePath, JSON.stringify(wishListData), (err: Error) => {
                    if (err) {throw err}
                    console.log("Data have been saved")
                    return resolve(magicLinkUrl + authRequests.token)
                })
            }
            const tokenIndexInArray = wishListData.authRequests.findIndex((authRequest: IAuthRequest) => authRequest.email === email)
            if (tokenIndexInArray) wishListData.authRequests.splice(tokenIndexInArray, 1)
            const authRequests: IAuthRequest = {
                email: email,
                token: nanoid()
            } 
            wishListData.authRequests.push(authRequests)
            return resolve(magicLinkUrl + authRequests.token)
        })
    })



export default createMagicLink