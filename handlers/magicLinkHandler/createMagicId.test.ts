import createMagicId from "./createMagicId"

jest.mock('nanoid')

describe('emailIsValid function', () => {
    test('function should work with valid email. It should create and return magic link', () => {
        const email = 'testemail@email.com'
        
        return createMagicId(email).then((data) => {
            expect(data).toBe("xxxxxxxxxxxxxxxx")
        })
        throw new Error()
        // console.log(magicLink)
    })
    test('function should return an error, if provide invalid email', () => {
        const email = 'fav13va'
        return createMagicId(email).catch((err) => {
            expect(err.message).toBe('Email failed validation')
        })
    })
})