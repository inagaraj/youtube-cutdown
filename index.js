const express = require('express');
const cors = require('cors');
const fileMiddleware = require('express-multipart-file-parser');

const app = express();
app.use(express.json({limit: '200mb'}));



app.use(cors());
// app.use(cors({
//     origin: "*",
//     "methods": "GET,PUT,POST",
//     "preflightContinue": false,
//     "optionsSuccessStatus": 204,
//     credentials: true
// }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
  });
  
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

server.timeout = 600000;