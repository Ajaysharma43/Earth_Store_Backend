const mongoose = require('mongoose')

const ProductsSchemma = new mongoose.Schema({
    Name:{type:String},
    Type:{type:String},
    Price:{type:Number},
    Image:{type:String},
    Description:{type:String},
    Reviews : [{
        UserName : {type : String},
        email : {type : String},
        Review : {type : String},
        Rating : {type : String}
    }]
})

module.exports = mongoose.model('table1',ProductsSchemma)