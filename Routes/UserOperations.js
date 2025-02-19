const express = require('express')
const Router = express.Router();
const Users = require('../Schemma/UserSchemmma')

Router.post('/BlockUser' , async(req , res) => {
    try
    {
        const {UserID}  = req.body;
        const FindUser = await Users.findOne ({ _id : UserID})
        if(FindUser.Block == true)
        {
            FindUser.Block = false
        }
        else
        {
            FindUser.Block = true
        }
        await FindUser.save()
        res.json({FindUser : FindUser})
    }
    catch(error)
    {
        res.json({error : error})
    }
    
    
})
module.exports  = Router