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

Router.post('/CreateUser' , async(req , res) => {
    try
    {
        const { FormData } = req.body;
        const FindUser = await Users.findOne({PhoneNumber : FormData.PhoneNumber})
        if(FindUser)
        {
            res.json({Message : "User already existed" })
        }
        else
        {
            const set = {
                  UserName: FormData.UserName,
                  Password: FormData.Password,
                  PhoneNumber: FormData.PhoneNumber,
                };
                const dataset = new Users(set);
                const datasave = await dataset.save();
                const UsersData = await Users.find();
            res.json({Message : "User Created" , Users : UsersData})
        }
    }
    catch(error)
    {
        res.json({error : error})
    }
    
})

Router.delete('/DeleteUser' , async(req , res) => {
    const {Userid} = req.query;
    const Deleteuser = await Users.deleteOne({_id : Userid})
    const UsersData = await Users.find();
    res.json({Message : "User Deleted" , Users : UsersData})
})


module.exports = Router