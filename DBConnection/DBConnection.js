const mongoose = require('mongoose')
require('dotenv').config();

const URL = process.env.DB_URL;

const database = async () => {
   const con = await mongoose.connect(`${URL}`)
   
   console.log("connected successfully");
   
} 

module.exports = database