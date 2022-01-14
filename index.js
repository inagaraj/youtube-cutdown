const express = require('express');
const cors = require('cors');
const fileMiddleware = require('express-multipart-file-parser');
const app = express();
app.use(express.json({limit: '200mb'}));

const allowedOrigins = [
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost',
  'http://localhost:8080',
  'http://localhost:8100',
  'https://youtube-cutdown.herokuapp.com/',
];

// Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed by CORS'));
    }
  },
};

// Enable preflight requests for all routes
app.options('*', cors(corsOptions));
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

app.get('/', cors(corsOptions), (req, res, next) => {
  res.json({ message: 'This route is CORS-enabled for an allowed origin.' });
});

const server = app.listen(5000, () => {
  console.log('CORS-enabled web server listening on port 5000');
});

server.timeout = 600000;