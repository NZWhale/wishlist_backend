import path from "path";
import tmp from "tmp";
import WishListFileDatabase from "./database/Database";

export const createEmptyTestDatabase = () => {
    const dbFilePath = path.join(tmp.dirSync().name, "db.json")
    return {db: new WishListFileDatabase(dbFilePath), dbFilePath}
}