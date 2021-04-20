import * as EmailValidator from 'email-validator';
import WishListFileDatabase from "../../database/Database";

const createMagicId = async (dbInstance: WishListFileDatabase, email: string) => {
    const validationResult = EmailValidator.validate(email)
    if (!validationResult) {
        throw new Error("Email failed validation")
    }
    return await dbInstance.createMagicId(email)
}

export default createMagicId