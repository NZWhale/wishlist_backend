import {nanoid} from "nanoid";

// Separate id factory function with seed is needed for tests to assert ids.
// There are problems asserting snapshots with multiple users having same ids.
const createRandomId = (idLength: number, seed: string) => nanoid(idLength)

export default createRandomId;