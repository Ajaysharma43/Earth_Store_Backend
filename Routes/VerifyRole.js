const express = require('express');
const Router = express.Router();
const Users = require('../Schemma/UserSchemmma')
const VerifyRole = require('../AuthenticateToken/VerifyRole')

Router.post('/Verify' ,VerifyRole , async(req ,res) => {

})

module.exports = Router;