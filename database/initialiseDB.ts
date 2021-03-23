import { IWishListDb} from "../interfaces"

const fs = require('fs')
const dataPath = './data'
const databasePath = './data/WishListDB.json'
// const initialiseDB = (db: any, callback:(err: Error, dbName: string) => void) => {

// }

async function initialiseDB() {
    const databaseFile = await new Promise((resolve, reject) => {
        fs.readdir(dataPath, (err: Error, files: Array<string>) => {
            if (err) {
                fs.mkdir(dataPath, (err: Error) => {
                    if (err) return reject(err)
                    const data: IWishListDb = {
                        "rooms": [],
                        "users": [],
                        "sessions": [],
                        "wishes": [],
                        "authRequests": []
                    }
                    fs.writeFile(databasePath, JSON.stringify(data), (err: Error) => {
                        if (err) return reject(err)
                        console.log("Data has been saved!")
                        return resolve(data);
                    })
                })
            }
            fs.readFile(databasePath, { encoding: 'utf8' }, (err: Error, data: IWishListDb) => {
                if (err) {
                    const data: IWishListDb = {
                        "rooms": [],
                        "users": [],
                        "sessions": [],
                        "wishes": [],
                        "authRequests": []
                    }
                    fs.writeFile(databasePath, JSON.stringify(data), (err: Error) => {
                        if (err) return reject(err)
                        console.log("Data has been saved!")
                        return resolve(data);
                    })
                }
            })
        })
    })
    return databaseFile
}


export default initialiseDB