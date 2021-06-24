const { writeToFile } = require('../functionality/writer');
let router = require('express').Router();
const { logHTTP } = require('../logger')

router.post('/:filePath', async(req, res) => {
    let response = await writeToFile(req.body.data, req.params.filePath)
    logHTTP(req, response)
    res.send(response) 
})

module.exports = router