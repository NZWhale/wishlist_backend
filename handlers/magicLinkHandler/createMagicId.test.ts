import createMagicId from "./createMagicId"
import {createEmptyTestDatabase} from "../../testUtils";

jest.mock('../../createRandomId')

describe('createMagicId function', () => {
    test('function should work with valid email. It should create and return magic link', async () => {
        const email = 'testemail@email.com'

        const {db} = createEmptyTestDatabase();
        const magicId = await createMagicId(db, email);

        expect(magicId).toBe("xtestemail@email")
    })
    test('function should return an error, if provide invalid email', () => {
        const email = 'fav13va'
        const {db} = createEmptyTestDatabase();
        expect(createMagicId(db, email)).rejects.toEqual(new Error('Email failed validation'))
    })
})