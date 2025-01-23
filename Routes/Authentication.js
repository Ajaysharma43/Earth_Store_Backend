const express = require("express");
const router = express.Router();
const twillo = require("twilio");
const jwt = require('jsonwebtoken')
const Users = require('../Schemma/UserSchemmma')
const Authenticate = require('../AuthenticateToken/AuthenticateToken')
require("dotenv").config();

const app = express();

const accountid = process.env.ACCOUNT_ID;
const authtoken = process.env.AUTH_TOKEN;
const client = new twillo(accountid, authtoken);

router.post("/SentOtp", async (req, res) => {
  const PhoneNumber = req.body.PhoneNumber;
  if (PhoneNumber) {
    const phoneNumber = `+91${PhoneNumber}`;
    const otp = Math.floor(100000 + Math.random() * 900000);
    client.messages.create({
      body: otp,
      from: process.env.TWILLO_NO,
      to: phoneNumber,
    });
    res.json({ otp }); 
  } else {
    res.json({ message: "phone number not found" }); 
  }
});


router.post('/SaveData' , async(req,res) => {
    const {Data} = req.body;
    
    const existed = await Users.findOne({PhoneNumber : Data.Data.Phone})
    if(existed)
    {
       res.send('existed') 
    }
    else
    {
        const set = {UserName : Data.Data.Username , Password : Data.Data.Password ,PhoneNumber: Data.Data.Phone}
        const dataset = new Users(set);
        const datasave = await dataset.save();
    }
    
})

router.post('/Login' , async(req,res) => {
  try{ 
    const {UserName , Password ,PhoneNumber} = req.body;
    const user = await Users.findOne({PhoneNumber : PhoneNumber})
    if(user)
    {
      const payload = { Username : user.UserName , Password : user.Password , phoneNumber : user.Password}
    const token  = jwt.sign(payload , process.env.JWT_SECRET_KEY)
    res.json({message : "Valid" , token})
    }
    else
    {
      res.json({message : "not a valid user"})
    }
    
  }
  catch(error)
  {
    console.error("The error Is " + error);
    
  }
})

router.post('/VerifyUser' , Authenticate ,  async(req , res) => {
  try
  {
    const {token} = req.body;
    const verify = jwt.verify(token , process.env.JWT_SECRET_KEY)
    if(verify)
    {
      res.json({message : "token is valid" , verify , user : req.user})
    }
  }
  catch(error)
    {
      console.error(error)
    }
})

router.post('/VerifyRoute' , Authenticate , async(req , res) => {
  try 
  {
    res.json({ message: "valid", user: req.user });
  }
  catch(error)
  {
    console.log("the error is " + error);
    
  }
})
module.exports = router;
