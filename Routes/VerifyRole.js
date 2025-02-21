const express = require('express');
const Router = express.Router();
const Users = require('../Schemma/UserSchemmma')
const VerifyRole = require('../AuthenticateToken/VerifyRole')
const VerifyBlock = require('../AuthenticateToken/VerifyBlock')

Router.post('/Verify' ,VerifyRole , async(req ,res) => {

})

Router.post('/VerifyBlock' , VerifyBlock , async(req , res) => {

})

module.exports = Router;