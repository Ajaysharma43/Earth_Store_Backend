const mongoose = require("mongoose");

// Function to get current date in Indian Standard Time (IST)
const getISTDate = () => {
  return new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
};

const UsersSchemma = new mongoose.Schema({
  UserName: { type: String },
  Password: { type: String },
  PhoneNumber: { type: String },
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
      ProductID: { type: String },
      Name: { type: String },
      Type: { type: String },
      Price: { type: Number, set: (value) => parseFloat(value.toFixed(2)) },
      Image: { type: String },
      Description: { type: String },
      Quantity: { type: Number },
      PlacedAt: { type: String, default: getISTDate }, // Store in IST format
      PaymentMethod: { type: String },
    },
  ],
  OrderHistory: [
    {
      ProductID: { type: String },
      Name: { type: String },
      Type: { type: String },
      Price: { type: Number, set: (value) => parseFloat(value.toFixed(2)) },
      Image: { type: String },
      Description: { type: String },
      Quantity: { type: Number },
      PlacedAt: { type: String, default: getISTDate }, // Store in IST format
      PaymentMethod: { type: String },
    },
  ],
});

module.exports = mongoose.model("table2", UsersSchemma);
