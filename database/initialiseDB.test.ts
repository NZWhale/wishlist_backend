import { IWishListDb } from "../interfaces"
import initialiseDB from "./initialiseDB"


describe('initialiseDB function', () => {
    test('Should return database file', () => {
        const expectedData: IWishListDb = {
            "rooms": [],
            "users": [],
            "sessions": [],
            "wishes": [],
            "authRequests": []
        }
        return initialiseDB().then(data => {
        expect(data).toEqual(expectedData)
        })
    })
})