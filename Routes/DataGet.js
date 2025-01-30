const express = require("express");
const router = express.Router();
const data = require("../Schemma/DataSchemma");
const Users = require("../Schemma/UserSchemmma");
const Authenticate = require("../AuthenticateToken/AuthenticateToken");
const shuffle = require("../Functions/DataGetFunctions/Shuffle");
const CryptoJS = require("crypto-js");
const Encryption = require("../Functions/Encryption_Decryption/Encryption");
const Decryption = require("../Functions/Encryption_Decryption/Decryption");
const { Message } = require("twilio/lib/twiml/MessagingResponse");
const { parse } = require("dotenv");

const app = express();

router.get("/data", async (req, res) => {
  const limit = parseInt(req.query.limit);
  const currentPage = parseInt(req.query.currentPage);
  const Skip = limit * currentPage - limit;
  const total = await data.countDocuments();
  const totalpages = Math.ceil(total / limit);
  const Data = await data.find().limit(limit).skip(Skip);
  Data.sort((a, b) => a.Name.localeCompare(b.Name));
  res.json({ Data, currentPage, totalpages });
});

router.post("/Product", async (req, res) => {
  const Id = req.body.id;
  const Product = await data.findOne({ _id: Id.id });
  res.json({ Product });
});

router.post("/RelatedProduct", async (req, res) => {
  const Id = req.body.id;
  const type = req.body.test;
  const User = await data.findOne({ _id: Id });
  console.log(type);
  const Data = await data.find({ Type: type });
  const result = shuffle(Data, User);
  res.json({ result });
});

router.post("/Review", async (req, res) => {
  try {
    const { Reviews, id, Userid  } = req.body;

    const Data = await data.findOne({ _id: Reviews.id });
    const User = Data.Reviews.find(
      (item) => item.Email === Reviews.Reviews.Email
    );

    if (User) {
      res.json({ Message: "Already Reviwed" });
    } else {
      Data.Reviews.push(Reviews.Reviews);
      await Data.save();
      res.json({ Message: "Reviewd" });
    }
  } catch (error) {
    console.error(error);
  }
});

router.get("/UserReview", async (req, res) => {
  try {
    const { id, productid } = req.query;

    // Find the product by its ID
    const product = await data.findOne({ _id: productid });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Filter reviews where the user ID matches the provided ID
    const matchingReviews = product.Reviews.filter(
      (review) => review.Userid == id
    ); // Directly compare the Userid with the provided ID

    res.json({ reviews: matchingReviews, userId: id });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({ error: "Failed to process request." });
  }
});

router.put("/UpdateReview", async (req, res) => {
  try {
    const { USERID, ID, Review, ProductID } = req.body;
    console.log("executed");

    const updatedProduct = await data.findOneAndUpdate(
      { _id: ProductID, "Reviews.Userid": USERID }, // Find product with matching Review
      {
        $set: {
          "Reviews.$.Review": Review.Review, // Update the review text
          "Reviews.$.Rating": Review.Rating, // Update the rating
        },
      },
      { new: true } // Return the updated document
    );

    console.log(updatedProduct);

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product or Review not found" });
    }

    res.json({ message: "Review updated successfully", updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/DeleteReview", async (req, res) => {
  try {
    const { ReviewID, id, Userid } = req.query;

    const product = await data.findOne({ _id: id });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const reviewIndex = product.Reviews.findIndex((item) => item.id === ReviewID);

    if (reviewIndex === -1) {
      return res.status(404).json({ message: "Review not found" });
    }

    product.Reviews.splice(reviewIndex, 1);

    await product.save();

    res.status(200).json({ message: "Review deleted successfully" });

  } catch (error) {
    console.error("Error deleting review:", error);

    res.status(500).json({ message: "Error deleting review" });
  }
});


module.exports = router;
