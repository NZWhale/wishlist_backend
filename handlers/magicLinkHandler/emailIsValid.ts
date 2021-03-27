import * as EmailValidator from 'email-validator';
import { nanoid } from 'nanoid'
import { magicLinkUrl } from '../../addresses';
import WishListFileDatabase from '../../database/Database';
import { IAuthRequestRow, IUserRow, IWishListDb } from '../../database/interfaces';

const fs = require('fs')
const databasePath = './data/WishListDB.json'

const emailIsValid = async (email: string) => {
        const validationResult = EmailValidator.validate(email)
        if (!validationResult) {
            throw new Error("Email failed validation")
        }
        const dbInstance = new WishListFileDatabase(databasePath)
        const magicId = await dbInstance.createMagicId(email)
        return magicId
    }



export default emailIsValid