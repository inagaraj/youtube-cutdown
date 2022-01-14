const express = require('express');
const cors = require('cors');
const fileMiddleware = require('express-multipart-file-parser');

const app = express();
app.use(express.json({limit: '200mb'}));

app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
});

// app.use(cors());
app.use(cors({
    origin: "*",
    "methods": "GET,PUT,POST",
    "preflightContinue": false,
    "optionsSuccessStatus": 204,
    credentials: true
}));
app.use(fileMiddleware);

require('dotenv').config({ path: __dirname + '/.env' });

// Logger
if (process.env.ENV === "DEV") {
    // console.log("Will Start Logging");
    const logger = require('morgan');
    app.use(logger('dev'));
}

app.use(express.static('./downloads'));

const ytdlControllers = require('./src/controllers/ytdl.controller');
app.use(ytdlControllers)

const port = process.env.PORT;

const server = app.listen(port, () => {
    console.log(`listening on port ${port}`);
})

server.timeout = 60000;