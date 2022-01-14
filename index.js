const express = require('express');
const cors = require('cors');
const fileMiddleware = require('express-multipart-file-parser');

const app = express();
app.use(express.json({limit: '200mb'}));



// app.use(cors());
// app.use(cors({
//     origin: "*",
//     "methods": "GET,PUT,POST",
//     "preflightContinue": false,
//     "optionsSuccessStatus": 204,
//     credentials: true
// }));
const allowedOrigins = [
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
    'http://localhost:8080',
    'http://localhost:8100',
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
  
  app.get('/', cors(corsOptions), (req, res, next) => {
    res.json({ message: 'This route is CORS-enabled for an allowed origin.' });
  });
app.use(fileMiddleware);
app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
});
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