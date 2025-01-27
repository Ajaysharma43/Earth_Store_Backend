const express = require("express");
const router = express.Router();
const twillo = require("twilio");
const jwt = require("jsonwebtoken");
const Bycrypt = require('bcrypt')
const Users = require("../Schemma/UserSchemmma");
const Authenticate = require("../AuthenticateToken/AuthenticateToken");
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

router.post("/SaveData", async (req, res) => {
  const { Data } = req.body;

  const existed = await Users.findOne({ PhoneNumber: Data.Data.Phone });
  if (existed) {
    res.send("existed");
  } else {
    const RefreshToken = jwt.sign({}, process.env.JWT_SECRET_KEY);
    const set = {
      UserName: Data.Data.Username,
      Password: Data.Data.Password,
      PhoneNumber: Data.Data.Phone,
      RefreshToken: RefreshToken,
    };
    const dataset = new Users(set);
    const datasave = await dataset.save();
  }
});

router.post("/Login", async (req, res) => {
  try {
    const { UserName, Password, PhoneNumber } = req.body;

    const user = await Users.findOne({ PhoneNumber: PhoneNumber });
    if (user) {
      const Username = Bycrypt.hash(user.UserName , 10)
      const Password = Bycrypt.hash(user.Password , 10)
      const accesstoken = jwt.sign({}, process.env.JWT_SECRET_KEY, {
        expiresIn: '2h',
      });
      const refreshToken = jwt.sign({}, process.env.JWT_SECRET_KEY, {
        expiresIn: '7d',
      });

      res.json({
        message: "Valid",
        token: accesstoken,
        refreshToken: refreshToken,
        Username : UserName,
        Password : Password
      });
    } else {
      res.json({ message: "not a valid user" });
    }
  } catch (error) {
    console.error("The error Is " + error);
  }
});

router.post("/VerifyUser", Authenticate, async (req, res) => {
  try {
    const { token } = req.body;
    const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (verify) {
      res.json({ message: "token is valid", verify, user: req.user });
    }
  } catch (error) {
    console.error(error);
  }
});

router.post("/VerifyRoute", Authenticate, async (req, res) => {
  try {
    res.json({ message: "valid", user: req.user });
  } catch (error) {
    console.log("the error is " + error);
  }
});

router.post("/RefreshToken", (req, res) => {
  try {
    const { RefreshToken } = req.body;

    if (RefreshToken) {
      jwt.verify(RefreshToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            console.log("Refresh token expired");
            return res.json({ message: "expired" });
          }

          console.log("Error verifying refresh token:", err);
          res.status(401).json({ message: "Invalid refresh token" });
        }
        console.log("Refresh token verified");
        const AccessToken = jwt.sign({}, process.env.JWT_SECRET_KEY, {
          expiresIn: 10,
        });
        console.log("new token generated");

        return res.json({ message: "verified", AccessToken: AccessToken });
      });
    } else {
      return res.json({ message: "NotExisted" });
    }
  } catch (error) {
    console.error("Error handling refresh token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/GenerateRefreshToken", async (req, res) => {
  const Token = jwt.sign({}, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
  res.json({ Token });
});

module.exports = router;
