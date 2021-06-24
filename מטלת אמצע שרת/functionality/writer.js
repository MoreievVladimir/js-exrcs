const fs = require('fs')
require('dotenv').config();

async function writeToFile(data, path) {

    let actualPath = `${process.env.FILES_PATH}${path}`
    try {
        if (fs. existsSync(actualPath)) {
            let err = new Error
            if (fs.lstatSync(actualPath).isDirectory()) {
    
                err.code = 'DIR'
            }
            else {
                err.code = 'ENNOENT'
            }
            
            throw err
        }

        else {
            //no errors
            fs.writeFile(actualPath, data, { flag: 'wx' }, (err) => {})
            return "Success"
        }
    }
    catch (err) {
        if (err.code == 'ENNOENT') {
            return `Error: File already exists, can't override`
        }
        else if (err.code == 'DIR') {
            return `Error: Can't modify directory`
        }
    }
   
}

module.exports = { writeToFile }