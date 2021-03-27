import * as EmailValidator from 'email-validator';
import { nanoid } from 'nanoid'
import { magicLinkUrl } from '../../addresses';
import { IAuthRequestRow, IUserRow, IWishListDb } from '../../database/interfaces';

const fs = require('fs')
const databasePath = './data/WishListDB.json'

const emailIsValid = async (email: string): Promise<string> => new Promise((resolve, reject) => {
        const validationResult = EmailValidator.validate(email)
        if (!validationResult) {
            return reject(new Error("Email failed validation"))
        }
        fs.readFile(databasePath, { encoding: 'utf8' }, (err: Error, data: string) => {
            if (err) return reject(err)
            console.log(data)
            const wishListData: IWishListDb = JSON.parse(data)
            const isUserExist = wishListData.users.find((user: IUserRow) => user.email === email)
            if (!isUserExist) {
                const userId = nanoid(10)
                const newUser: IUserRow = {
                    userId: userId,
                    email: email
                }
                wishListData.users.push(newUser)
                const authRequests: IAuthRequestRow = {
                    email: email,
                    token: nanoid()
                }
                wishListData.authRequests.push(authRequests)
                fs.writeFile(databasePath, JSON.stringify(wishListData), (err: Error) => {
                    if (err) {throw err}
                    console.log("Data have been saved")
                })
                return resolve(magicLinkUrl + authRequests.token)
            }
            const tokenIndexInArray = wishListData.authRequests.findIndex((authRequest: IAuthRequestRow) => authRequest.email === email)
            if (tokenIndexInArray) wishListData.authRequests.splice(tokenIndexInArray, 1)
            const authRequests: IAuthRequestRow = {
                email: email,
                token: nanoid()
            } 
            wishListData.authRequests.push(authRequests)
            fs.writeFile(databasePath, JSON.stringify(wishListData), (err: Error) => {
                if (err) {throw err}
                console.log("Data have been saved")
            })
            return resolve(magicLinkUrl + authRequests.token)
        })
    })



export default emailIsValid