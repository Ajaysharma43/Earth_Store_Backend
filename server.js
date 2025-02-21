const express = require('express');
const dbconnection = require('./DBConnection/DBConnection');
const Upload = require('./Routes/DataUploadRoutes');
const GetData = require('./Routes/DataGet');
const Autherize = require('./Routes/Authentication')
const Cart = require('./Routes/Cart')
const Checkout = require('./Routes/Checkout')
const VerifyRole = require('./Routes/VerifyRole')
const UsersOperations = require('./Routes/UserOperations')
const bodyParser = require("body-parser");
const cors = require('cors');
const firebae = require('firebase-admin')

const app = express();

dbconnection();

// Allow localhost (for development) and your live domain
const allowedOrigins = [
    `${process.env.LOCAL_SERVER}`, // Localhost for development
    `${process.env.LIVE_SERVER}`, // Add live server URL
];

// CORS Options
const corsOptions = {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);
  
      if (allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the origin
      } else {
        callback(new Error('Not allowed by CORS')); // Reject the origin
      }
    },
  };

app.use(cors(corsOptions));


app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/Upload', Upload);
app.use('/Data', GetData)
app.use('/Autheorize', Autherize)
app.use('/Cart', Cart)
app.use('/Checkout', Checkout)
app.use('/VerifyRole' , VerifyRole)
app.use('/UsersOperations'  , UsersOperations)

app.listen(3000);
