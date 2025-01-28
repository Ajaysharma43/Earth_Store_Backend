const mongoose = require("mongoose");
const UsersSchemma = new mongoose.Schema({
  UserName: { type: String },
  Password: { type: String },
  PhoneNumber: { type: String },
  FavouriteProducts: [
    {
      Name: { type: String },
      Type: { type: String },
      Price: { type: Number },
      Image: { type: String },
      Description: { type: String },
    },
  ],
  UserReviews: [{
    Userid : {type: String},
      UserName: { type: String },
      Email: { type: String },
      Review: { type: String },
      Rating: { type: String },
  }]
});

module.exports = mongoose.model("table2", UsersSchemma);
