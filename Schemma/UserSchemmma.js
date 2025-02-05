const mongoose = require("mongoose");
const UsersSchemma = new mongoose.Schema({
  UserName: { type: String },
  Password: { type: String },
  PhoneNumber: { type: String },
  CartProducts: [{
    ProductID: { type: String },
    Name: { type: String },
    Type: { type: String },
    Price: { type: Number },
    Image: { type: String },
    Description: { type: String },
    Quantity: { type: Number }
  }],
  Chekout : [{
    UUid : {type : String},
    ProductID: { type: String },
    Name: { type: String },
    Type: { type: String },
    Price: { type: Number },
    Image: { type: String },
    Description: { type: String },
    Quantity: { type: Number }
  }]
});

module.exports = mongoose.model("table2", UsersSchemma);
