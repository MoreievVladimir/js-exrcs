require('dotenv').config();
const fs = require('fs')
const axios = require('axios');
const { env } = require('process');
const { resolve } = require('path');

// function to read all files in 'Dir'

function readDir() {

    let dirFiles = []
    let filesToUpload = []
    let uploadedFiles = []

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
            if ([...file][file.length - 2] + [...file][file.length - 1] != '.s') {
                // '%.s' means 'saved', therefor wasnt uploaded yet
                filesToUpload.push(file)
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

        console.log('------------------------------\niterating ' + file)
        let numOfFails = 0
        if (!isNaN(file[file.length - 1])) {
          numOfFails = parseInt(file[file.length - 1])

          if (numOfFails >= process.env.MAX_ALLOWED_TRIES_PER_FILE) {
            console.log(`File ${file} exceeded allowed amount of tries to upload (${process.env.MAX_ALLOWED_TRIES_PER_FILE}), skipping;`)
            continue;
          }

          fs.renameSync('Dir/' + file, 'Dir/' + file.substring(0, file.length - 2), () => {})
          file = file.substring(0, file.length - 2)
          console.log('Temporary name: ' + file + ', amount of fails ' + numOfFails)
        }

          await readFile(file).then(async (fileData) => {

            // Error handling
            if (fileData.substring(0,5).includes('Error')) {
              console.log(fileData + ', skipping;') 
            }

            else {
          await axios
        .post(
          `http://localhost:${process.env.FILE_SERVER_PORT}/write/${file}`,
          { 'data': fileData },
          {
            headers: {
              "content-type": "application/json"
            }
          }
        ).then(function (response) {
            console.log('(' + response.config.method.toUpperCase() + ') ' 
              + response.config.url + '\n' + response.request.socket._host 
              + ' Responded: Status: ' + response.status + ', Data: ' + response.data);
               
              if (response.data == `Success` || response.data == `Error: File already exists, can't override`) {
                uploadedFiles.push(file)
              }
          })
          .catch(function (error) {
            console.log(`Error: ${error.code}: couldn't save ${file}, Fail number ${numOfFails + 1}`);
            renameFailed(file, (numOfFails + 1))
          })
        }
        })    
      }

      renameUploaded(uploadedFiles)
      
      async function readFile(path) {
        let actualPath = `${process.env.DIR_PATH}${path}`
        let fileData = new Promise((resolve, reject) => {
    
            if (!fs.existsSync(actualPath)) {
                console.error(`File doesn't exist!`)
                // find a way to gently handle errors
                let err = new Error
                // err.code = 'EEXIST'
                err.message = `Error: Can't find specified file`
                resolve(err.message)
            }
            else if (fs.lstatSync(actualPath).isDirectory()) {
                console.error(`Can't read directory!`)
                // find a way to gently handle errors
                let err = new Error
                // err.code = 'DIR'
                err.message = `Error: Can't read directory`
                resolve(err.message)
            }
            else {       
                fs.readFile(actualPath, (err, data) => {       
                    resolve(data)
                })
            }
        }).catch((err) => {
          // unexpected errors
            console.log(err)
        })
  
          let result = await new Promise((resolve, reject) => {
            resolve(fileData.then((value) => { return value.toString() } ))         
        })
    
        return  result         
      }
    }

    async function renameUploaded(file) {

      for (file of uploadedFiles) {

          //didn't fail before
          fs.renameSync(process.env.DIR_PATH + file, process.env.DIR_PATH + file + '.s', () => {});

          //failed before 
          // fs.renameSync(process.env.DIR_PATH + file, process.env.DIR_PATH + file + numOfFails + 's', () => {});

        // renaming to mark it as saved ('s')
      }
    }

    async function renameFailed(updatedFile, fail) {
        // first time fail
        fs.renameSync(process.env.DIR_PATH + file, process.env.DIR_PATH + file + '.' + fail, () => {});  
    }
  }
  
  module.exports = { readDir }