require('dotenv').config();
const fs = require('fs')
const axios = require('axios');

// function to read all files in 'Dir'

function readDir() {

    let dirFiles = []
    let filesToUpload = []

    console.log('\n------------------------Uploading------------------------')
    let date = new Date()
    console.log(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)

    fs.readdir(process.env.DIR_PATH, (err, files) => {
      if (err)
        console.log(err.code);
      else {
        console.log("\nCurrent directory filenames:");
        files.forEach(file => {
          console.log(file);
          dirFiles.push(file)
        })
        for (file of dirFiles) {
            if (![...file][file.length] == 's') {
                // means 'saved', therefor wasnt uploaded yet
                filesToUpload.push(file)
                global.readFiles.push(file)
                fs.rename(file, `${file}s`);
                // renaming to mark it as saved
            }
        }
        if (filesToUpload.length == 0) {
          console.log('files to upload: none')
        }
        else {
          console.log('files to upload: ' + filesToUpload)
        }
      
        saveFilesToServer().then(() => {
            console.log('--------------------Uploading COMPLETE-------------------\n')
        })
      }
    })
  
    async function saveFilesToServer() {
      for (file of filesToUpload) {
          await readFile(file).then((fileData) => {
          axios
        .post(
          `http://localhost:${process.env.FILE_SERVER_PORT}/write/${file}`,
          { 'data': fileData },
          {
            headers: {
              "content-type": "application/json"
            }
          }
        ).then(function (response) {
            console.log('(' + response.config.method.toUpperCase() + ') ' + response.config.url + '\n' + response.request.socket._host + ' Responded: Status: ' + response.status + ', Data: ' + response.data);
          })
          .catch(function (error) {
            console.log(error.code);
          })
        })    
      }
  
      
  
      async function readFile(path) {
        let actualPath = `${process.env.DIR_PATH}${path}`
        let fileData = new Promise((resolve, reject) => {
    
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
    }
  }
  
  module.exports = { readDir }