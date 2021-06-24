const fs = require('fs')

async function logHTTP(req, response) {
    let date = new Date()
    // log format : date | (time) (HTTP request type) path/route || response 
    let log = `${date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear()} | (${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}) (${req.method}) ${req.originalUrl} || ${response}`;
    console.log(log)
    fs.appendFileSync('./logs/HTTP.txt', '\n' + log)
}

module.exports = { logHTTP }