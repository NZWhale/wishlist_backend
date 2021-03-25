import { IWishListDb } from "../interfaces"

const fs = require('fs')
const dataPath = './data'
const databasePath = './data/WishListDB.json'

const initialiseDB = async () => await new Promise((resolve, reject) => {
    fs.readdir(dataPath, (err: Error, files: Array<string>) => {
        if (err) {
            fs.mkdir(dataPath, (err: Error) => {
                if (err) return reject(err)
                const data: IWishListDb = createEmptyDbContent()
                fs.writeFile(databasePath, JSON.stringify(data), (err: Error) => {
                    if (err) return reject(err)
                    console.log("Data has been saved!")
                    return resolve(data);
                })
            })
        }
        fs.readFile(databasePath, { encoding: 'utf8' }, (err: Error, data: string) => {
            if (err) {
                const data: IWishListDb = createEmptyDbContent()
                fs.writeFile(databasePath, JSON.stringify(data), (err: Error) => {
                    if (err) return reject(err)
                    console.log("Data has been saved!")
                    return resolve(data);
                })
            }
            return resolve(JSON.parse(data));
        })
    })
})

const createEmptyDbContent = (): IWishListDb => {
    return {
        "rooms": [],
        "users": [],
        "sessions": [],
        "wishes": [],
        "authRequests": []
    }
}

export default initialiseDB