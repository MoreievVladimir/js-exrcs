const fs = require('fs');

require('dotenv').config();

async function createFile(data, path) {
    path = process.env.FILES_PATH + path
    console.log(path)
    await fs.writeFile(path, data, { flag: 'wx' }, (err) => {
        if (fs.lstatSync(path).isDirectory()) {

            console.log(`Can't write in directory!`)
        }
        else {

            if (err.code == 'EEXIST') {

                console.log('File already exists! Overriding')
                fs.writeFile(path, data, (err) => {})
            }

            console.log('file was saved at ' + path)
        }
    })
}

async function test () {
    createFile('Hello1', 'test52.txt')
}
test()

// configurative vars : file .env ( file paths )