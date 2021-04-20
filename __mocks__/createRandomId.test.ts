import createRandomId from './createRandomId';

describe('createRandomId mock', function () {
    test('should add a special symbol at the beginning of id and fill the rest of id length', () => {
        expect(createRandomId(16, '420@chill.com')).toBe('x420@chill.comxx')
    })

    test('should cut tail of seed if it\'s length is greater than id length', () => {
        expect(createRandomId(16, 'bumpie@gmail.com')).toBe('xbumpie@gmail.co')
    })
});