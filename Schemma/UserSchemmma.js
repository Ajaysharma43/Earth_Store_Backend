const mongoose = require('mongoose');
const UsersSchemma = new mongoose.Schema({
    UserName : {type : String},
    Password : {type : String},
    PhoneNumber : {type : String}
})

module.exports = mongoose.model('table2' , UsersSchemma)