// 8.
const fs = require('fs');
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

async function getData() {
    console.log(await readTwoFiles(['./test.txt', './test2.txt']))
}
getData()