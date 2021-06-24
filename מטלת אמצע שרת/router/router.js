let router = require('express').Router();

// Home Page 
router.get('/', (req, res) => {
    res.send('ʕ•ᴥ•ʔ')
    console.log('Home Page')
})

router.use('/read', require('./fileReaderRouter'))  
router.use('/write', require('./fileWriterRouter')) 

module.exports = router