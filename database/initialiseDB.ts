import {IWishListDb} from "./interfaces"
import {createEmptyDbContent} from "./dbRelatedFunctions";

const fs = require('fs')
const path = require('path')
const dataPath = path.basename('./data')
const databasePath = path.basename('./data/WishListDB.json')

const initialiseDB = async (): Promise<IWishListDb> => await new Promise((resolve, reject) => {
    fs.readdir(dataPath, (err: Error) => {
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
        fs.readFile(databasePath, { encoding: 'utf-8' }, (err: Error, data: string) => {
            if (err) {
                const data: IWishListDb = createEmptyDbContent()
                fs.writeFile(databasePath, JSON.stringify(data), (err: Error) => {
                    if (err) return reject(err)
                    console.log("Data has been saved!")
                    return resolve(data);
                })
            }
            const database: string = data
            console.log(data)
            return database
        })
    })
})

export default initialiseDB