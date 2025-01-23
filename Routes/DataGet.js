const express = require('express');
const router = express.Router();
const data = require('../Schemma/DataSchemma')
const Authenticate = require('../AuthenticateToken/AuthenticateToken')
const shuffle = require('../Functions/DataGetFunctions/Shuffle')

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


module.exports = router;