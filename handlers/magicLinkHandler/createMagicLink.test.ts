import createMagicLink from "./createMagicLink"

describe('createMagicLink function', () => {
    test('function should work with valid email. It should create and return magic link', () => {
        const email = 'testemail@email.com'
        return createMagicLink(email).then((data) => {
            console.log(data)
        })
        // console.log(magicLink)
    })
    test('function should return an error, if provide invalid email', () => {
        const email = 'fav13va'
        return createMagicLink(email).catch((err) => {
            expect(err.message).toBe('Email failed validation')
        })
    })
})