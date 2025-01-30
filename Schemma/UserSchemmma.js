const mongoose = require("mongoose");
const UsersSchemma = new mongoose.Schema({
  UserName: { type: String },
  Password: { type: String },
  PhoneNumber: { type: String },
  CartProducts: [{
    Name: { type: String },
    Type: { type: String },
    Price: { type: Number },
    Image: { type: String },
    Description: { type: String },
  }]
});

module.exports = mongoose.model("table2", UsersSchemma);
