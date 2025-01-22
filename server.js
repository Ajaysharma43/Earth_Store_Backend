const express = require('express');
const dbconnection = require('./DBConnection/DBConnection');
const Upload = require('./Routes/DataUploadRoutes');
const GetData = require('./Routes/DataGet');
const Autherize = require('./Routes/Authentication')
const bodyParser = require("body-parser");
const cors = require('cors');
const firebae = require('firebase-admin')

const app = express();

dbconnection();

app.use(cors());


app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/Upload', Upload);
app.use('/Data',GetData)
app.use('/Autheorize' , Autherize)

app.listen(3000);
