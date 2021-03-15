import generateHelloMessage from "./generateHelloMessage"

describe("generateHelloMessage function", () => {
    test("should return hello message", () => {
        expect(generateHelloMessage()).toBe("Hello World")
    })
})