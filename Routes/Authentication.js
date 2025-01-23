const express = require("express");
const router = express.Router();
const twillo = require("twilio");
const jwt = require('jsonwebtoken')
const Users = require('../Schemma/UserSchemmma')
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
    const {_id,UserName , Password ,PhoneNumber} = req.body;
    const user = await Users.findOne({_id : _id})
    const payload = {_id  : user._id , Username : user.UserName , Password : user.Password , phoneNumber : user.Password}
    const token  = jwt.sign(payload , process.env.JWT_SECRET_KEY , {expiresIn : 60})
    res.json({user , token})
})

router.post('/VerifyUser' , async(req , res) => {
  try
  {
    const {token} = req.body;
    const verify = jwt.verify(token , process.env.JWT_SECRET_KEY)
    if(!verify)
    {
      res.json({message : "token is not valid"})
    }
  }
  catch(error)
    {
      console.error(error)
    }
})
module.exports = router;
