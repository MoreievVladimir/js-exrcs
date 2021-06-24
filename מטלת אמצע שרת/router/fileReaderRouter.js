const { readAFile, readMultipleFiles } = require('../functionality/reader');
let router = require('express').Router();

router.get(`/1/:filePath`, async (req, res) => {
    res.send(await readAFile(req.params.filePath))
})

router.get(`/readMultipleFiles`, async (req, res) => {
    // console.log(JSON.parse(req.query.filePaths))
    res.send(await readMultipleFiles(JSON.parse(req.query.filePaths)))
})

module.exports = router