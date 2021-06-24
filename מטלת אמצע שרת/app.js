const express = require('express');
const app = express();
require('dotenv').config();
let router = require('express').Router();
const bodyParser = require("body-parser");

// body parser for POST requests
// A middleware required for extracting data from POST requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(process.env.PORT, () => {
    console.log(`App runs on port ${process.env.PORT}`)
})

app.use(router)

router.use(require('./router/router.js'))
