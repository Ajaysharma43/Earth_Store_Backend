const mongoose = require("mongoose");

const getISTDate = () => {
  return new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
};

const UsersSchemma = new mongoose.Schema({
  UserName: { type: String },
  Password: { type: String },
  PhoneNumber: { type: String },
  Role: { type: String, enum: ["Admin", "User", "Editor"], default: "User" },
  Block: { type: Boolean, default: false },
  CartProducts: [
    {
      ProductID: { type: String },
      Name: { type: String },
      Type: { type: String },
      Price: { type: Number, set: (value) => parseFloat(value.toFixed(2)) },
      Image: { type: String },
      Description: { type: String },
      Quantity: { type: Number },
    },
  ],
  StripeID: { type: String },
  Checkout: [
    {
      Product: [{
        ProductID: { type: String },
        Name: { type: String },
        Type: { type: String },
        Price: { type: Number, set: (value) => parseFloat(value.toFixed(2)) },
        Image: { type: String },
        Description: { type: String },
        Quantity: { type: Number },
        PlacedAt: { type: String, default: getISTDate },
      }],
      Address: {
        Pincode: { type: String },
        Street: { type: String },
        Area: { type: String },
        City: { type: String },
        State: { type: String },
        Country: { type: String },
        PaymentMethod: { type: String },
      },
      ChargeID: { type: String },
    },
  ],
  OrderHistory: [
    {
      Product: [{
        ProductID: { type: String },
        Name: { type: String },
        Type: { type: String },
        Price: { type: Number, set: (value) => parseFloat(value.toFixed(2)) },
        Image: { type: String },
        Description: { type: String },
        Quantity: { type: Number },
        PlacedAt: { type: String, default: getISTDate },
      }],
      Address: {
        Pincode: { type: String },
        Street: { type: String },
        Area: { type: String },
        City: { type: String },
        State: { type: String },
        Country: { type: String },
        PaymentMethod: { type: String },
      },
      ChargeID: { type: String },
      OrderID: { type: String },
      Canceled: { type: Boolean, default: false },
      Reason: { type: String },
    },
  ],
});

module.exports = mongoose.model("table2", UsersSchemma);
