const express = require("express");
const router = express.Router();
const twillo = require("twilio");
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
    
})
module.exports = router;
