const fs = require('fs');
const { readFile } = require('fs').promises;

require('dotenv').config();

// 5. !

async function readFileGutsAsync(path) {

    return await readFile(path, (err, data) => { return data })
    
}

// async function getData () {
//     console.log(await readFileGutsAsync('./test.txt'));
// }
// getData()

// 6. 

function readFileGutsWithoutAwait(path) {
    return readFile(path, (err, data) => {
        if (err) {
            reject(err)
        }
    }).then((data) => {
        return data
    })

}


// async function getData() {
//     let data = await readFileGutsWithoutAwait('./test.txt')
//     console.log(data);
// }
// getData()

// 7. new promise

function readFileGutsPromise(path) {
    return new Promise((resolve, reject) => {

        if (!fs.existsSync(path)) {
            reject(`File doesn't exist!`)
        }
        else if (fs.lstatSync(path).isDirectory()) {
            reject(`Can't read directory!`)
        }
        else {          
            fs.readFile(path, (err, data) => {        
                resolve(data)
            })
        }
    }).catch((err) => {
        console.log(err)
    })
}


// async function getData () {
//     console.log(await readFileGutsPromise('./files/test4.png'));
// }
// getData()


// 8.

function readTwoFiles(pathArr) {

    let promiseArr = []

    for (path of pathArr) {
      promiseArr.push(new Promise((resolve, reject) => {
            fs.readFile(path, (err, data) => {
                if (!fs.existsSync(path)) {
    
                    resolve(`File wasn't found!`)
                }
                else if (fs.lstatSync(path).isDirectory()) {
    
                    resolve(`Can't read directory!`)
                }
    
                resolve(data)
            })
        })
    
      )}
    
     return Promise.all(promiseArr).then((values) => {
    
         return values
       });   
}

// async function getData() {
//     console.log(await readTwoFiles(['./test.txt', './test2.txt']))
// }
// getData()


// 9.

async function readFilesLikeBuffer(pathArr) {
    let currIndex = -1;
    let dataArray = [];
    const ALLOWED_PROCESSES_AMOUNT = 3;

    // basic error checking
    // doesnt exist, dir, no path ( length 0 will mess up logic )

    if (pathArr.length < 1) {
        return  ['no paths specified']
    }

    // using callbacks in order to put await for the processes

    while  (currIndex != pathArr.length - 1) {
        currIndex += ALLOWED_PROCESSES_AMOUNT
        let delta = ALLOWED_PROCESSES_AMOUNT

        if (currIndex >= pathArr.length) {
            currIndex -= ALLOWED_PROCESSES_AMOUNT
            delta = pathArr.length - 1 - currIndex
            currIndex = pathArr.length - 1
        }

        let promises = []

        for (let i = delta - 1; i >= 0; i-- ) {
            promises.push(readFileByIndex(currIndex - i))
            // console.log('amount of current processes: ' + promises.length)
        }

       await Promise.all([...promises]).then((datas) => {
            let index = 0
            for (data of datas) {
                dataArray.push(data)
                index --
            }
        })
    }

    return dataArray


    async function readFileByIndex(index) {

        const fileData = await new Promise((resolve, reject) => {


            fs.readFile(pathArr[index], (err, data) => {
            if (!fs.existsSync(pathArr[index])) {

                resolve(`File wasn't found!`)
            }
            else if (fs.lstatSync(pathArr[index]).isDirectory()) {

                resolve(`Can't read directory!`)
            }

                resolve(data)
            })
        });

        return fileData
    }
}


// async function getData () {
//     console.log(await readFilesLikeBuffer(['./test.txt', './test2.txt', './test2.txt', './test.txt', './test.txt']))
// }
// getData()