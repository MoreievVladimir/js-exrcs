const express = require('express');
const app = express();
require('dotenv').config();
let router = require('express').Router();
const { readDir } = require('./public/javascripts/DirReader');

// const bodyParser = require("body-parser");

// body parser for POST requests
// A middleware required for extracting data from POST requests
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// init
// global.readFiles = []

app.listen(process.env.PORT, () => {
    console.log(`App runs on port ${process.env.PORT}`)
})

setTimeout(() => readDir(), 1000);
setInterval(() => readDir(), 10000);


app.use(router)
router.use(require('./routes/index'))