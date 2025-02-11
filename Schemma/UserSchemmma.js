const mongoose = require("mongoose");
const UsersSchemma = new mongoose.Schema({
  UserName: { type: String },
  Password: { type: String },
  PhoneNumber: { type: String },
  CartProducts: [{
    ProductID: { type: String },
    Name: { type: String },
    Type: { type: String },
    Price: { type: Number , set: (value) => parseFloat(value.toFixed(2)) },
    Image: { type: String },
    Description: { type: String },
    Quantity: { type: Number }
  }],
  StripeID : {type : String},
  Checkout : [{
    ProductID: { type: String },
    Name: { type: String },
    Type: { type: String },
    Price: { type: Number , set: (value) => parseFloat(value.toFixed(2)) },
    Image: { type: String },
    Description: { type: String },
    Quantity: { type: Number },
    PlacedAt : {type : Date, default : Date.now()},
    PaymentMethod : {type : String}
  }],
  OrderHistory : [{
    ProductID: { type: String },
    Name: { type: String },
    Type: { type: String },
    Price: { type: Number , set: (value) => parseFloat(value.toFixed(2)) },
    Image: { type: String },
    Description: { type: String },
    Quantity: { type: Number },
    PlacedAt : {type : Date, default : Date.now()},
    PaymentMethod : {type : String}
  }]
});

module.exports = mongoose.model("table2", UsersSchemma);
