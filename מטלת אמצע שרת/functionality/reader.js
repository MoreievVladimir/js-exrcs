const fs = require('fs')
require('dotenv').config();

async function readAFile(path) {

    let actualPath = `${process.env.FILES_PATH}${path}`
    let fileData = new Promise((resolve, reject) => {

        // check manually for errors
        if (!fs.existsSync(actualPath)) {
            console.error(`File doesn't exist!`)
        }
        else if (fs.lstatSync(actualPath).isDirectory()) {
            console.error(`Can't read directory!`)
        }
        else {          
            fs.readFile(actualPath, (err, data) => {        
                resolve(data)
            })
        }
    }).catch((err) => {
        console.log(err)
    })
    
    let result = await new Promise((resolve, reject) => {
        resolve(fileData.then((value) => { return value.toString() } ))
    })

    return  result 
}

// multiple
async function readMultipleFiles(filePaths) {
    
    let results = []
    await scan();

    return results

    async function scan() {
        for (path of filePaths) {
            results.push(await readAFile(path))
        }
    }

    // seperate to threads
}

module.exports = { readAFile, readMultipleFiles }