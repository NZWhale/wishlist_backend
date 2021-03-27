import { IWishListDb } from "../interfaces"

const fs = require('fs')
const path = require('path')
const dataPath = path.basename('./data')
const databasePath = path.basename('./data/WishListDB.json')

const initialiseDB = async (): Promise<IWishListDb> => await new Promise((resolve, reject) => {
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
            return
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
            const database: IWishListDb = JSON.parse(data) 
            return database
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