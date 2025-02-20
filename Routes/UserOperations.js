const express = require('express')
const Router = express.Router();
const Users = require('../Schemma/UserSchemmma')

Router.post('/BlockUser', async (req, res) => {
    try {
        const { UserID } = req.body;
        const FindUser = await Users.findOne({ _id: UserID })
        if (FindUser.Block == true) {
            FindUser.Block = false
        }
        else {
            FindUser.Block = true
        }
        await FindUser.save()
        res.json({ FindUser: FindUser })
    }
    catch (error) {
        res.json({ error: error })
    }
})

Router.put('/UpdateUser', async (req, res) => {
    try {
        const { FormData } = req.body;
        
        const FindUser = await Users.findOneAndUpdate({ _id: FormData._id }, ({ $set: { UserName: FormData.UserName, Password: FormData.Password, PhoneNumber: FormData.PhoneNumber  , Role : FormData.Role , StripeID : FormData.StripeID , Block : FormData.Block} }))
        await FindUser.save()
        res.json({ User: FindUser })
    }
    catch (error) {
        res.json({ error: error })
    }
})


module.exports = Router