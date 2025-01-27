const express = require('express');
const router = express.Router();
const data = require('../Schemma/DataSchemma')
const Authenticate = require('../AuthenticateToken/AuthenticateToken')
const shuffle = require('../Functions/DataGetFunctions/Shuffle');
const { Message } = require('twilio/lib/twiml/MessagingResponse');

const app = express();

router.get('/data',async(req,res)=>{
    const limit = parseInt(req.query.limit)
    const currentPage = parseInt(req.query.currentPage)
    const Skip = limit*currentPage - limit;
    const total = await data.countDocuments();
    const totalpages = Math.ceil(total / limit)
    const Data = await data.find().limit(limit).skip(Skip);
    Data.sort((a,b)=>a.Name.localeCompare(b.Name))
    res.json({Data , currentPage , totalpages})
})

router.post('/Product',async(req,res)=>{
    const Id = req.body.id
    const Product = await data.findOne({_id:Id.id})
    res.json({Product})
})

router.post('/RelatedProduct' , async (req,res)=>{
    const Id = req.body.id;
    const type = req.body.test
    const User = await data.findOne({_id:Id})
    console.log(type);
    const Data = await data.find({Type:type});
    const result = shuffle(Data,User)
    res.json({result})
})

router.post('/Review' , async(req,res) => {
    try{
        const {Reviews , id} = req.body;
        const Data = await data.findOne({_id : Reviews.id})
        const User = Data.Reviews.find((item) => item.Email === Reviews.Reviews.Email)
        if(User)
        {
            console.log("already Review");   
            res.json({Message : "Already Reviwed"})
        }
        else
        {
            Data.Reviews.push(Reviews.Reviews)
            await Data.save()
            console.log(Data);
            res.json({Message : "Reviewd"})
        }
    }
    catch(error){
        console.error(error);
    }
})


module.exports = router;