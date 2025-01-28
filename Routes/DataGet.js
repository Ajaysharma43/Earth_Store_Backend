const express = require("express");
const router = express.Router();
const data = require("../Schemma/DataSchemma");
const Users = require("../Schemma/UserSchemmma");
const Authenticate = require("../AuthenticateToken/AuthenticateToken");
const shuffle = require("../Functions/DataGetFunctions/Shuffle");
const CryptoJS = require("crypto-js");
const Encryption = require('../Functions/Encryption_Decryption/Encryption')
const Decryption = require('../Functions/Encryption_Decryption/Decryption')
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
    const { Reviews} = req.body;

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


router.get('/UserReview' , async(req , res) => {
    try {
        const Encrypted = req.query.id
        const productid = req.query.productid
        const DecryptedID = Decryption(Encrypted)
        const Product = await data.findOne({_id:productid})
        const FindUserProducts = Product.Reviews.find((item) => Decryption(item.Userid) === DecryptedID)
        console.log(FindUserProducts);
        
        res.json({message : FindUserProducts})
    }
    catch(error)
    {
        console.log(error);
        
    }
})



router.post("/DeleteReview", async (req, res) => {
  try {
    const { UserID, Reviews } = req.body;
    const DecryptedID = CryptoJS.AES.decrypt(
      UserID,
      process.env.ENCRYPTION_DECRYPTION_KEY
    ).toString(CryptoJS.enc.Utf8);
    const FindUser = await Users.findOne({ _id: DecryptedID });
    res.json({ FindUser, Reviews });
  } catch (error) {
    console.error("the error is " + error);
  }
});

module.exports = router;
