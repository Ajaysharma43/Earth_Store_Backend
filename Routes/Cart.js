const express = require('express')
const Users = require('../Schemma/UserSchemmma');
const router = express.Router()

router.get('/GetCart' , async(req , res) => {
    try
    {
        const {UserID} = req.query;
        const User = await Users.findOne({_id : UserID})
        const CartProducts = User.CartProducts;
        res.json({Message : CartProducts})
    }
    catch(error)
    {
        console.error("the error is " + error);
    }
})

router.post('/AddCart' , async(req , res) => {
    try
    {
        const {Userid , Products , ProductID} = req.body
        const User = await Users.findOne({_id : Userid})
        const FindCart = User.CartProducts.find((cart) => cart.ProductID === ProductID)
        if(FindCart)
        {
            res.json({Message : "Existed"})
        }
        else
        {
            User.CartProducts.push(Products)
            await User.save()
            res.json({Message : "Saved to Cart"})
        }
    }
    catch(error)
    {
        console.error("the error is " + error);
        
    }
})

router.delete('/DeleteProduct' , async(req , res) => {
    try
    {
        const {UserID , ProductID} = req.query;
        const User = await Users.findOne({_id : UserID})
        const Product = User.CartProducts.find((item) => item.id === ProductID)
        if(Product)
        {
            Product.deleteOne();
            await User.save()
            res.json({message : "Removed"})
        }
        else
        {
            res.json({Message : "Not existed"})
        }
    }
    catch(error)
    {
        console.error(error);
        res.json({Message : error})
    }
})

router.delete('/DeleteCart' , async(req , res) => {
    const {UserID} = req.query;
    const User = await Users.findOne({_id : UserID});
    const FindCart = User.CartProducts;
    if(FindCart)
    {
        FindCart.pull();
        res.json({Message : "Deleted"})
    }
    else
    {
        res.json({Message : "Not Existed"})
    }
})

router.put('/UpdateQunatity' , async(req , res) => {
    try
    {
        const {UserID  , ProductID , Qunatity} = req.body;
        const User = await Users.findOne({_id : UserID});
        const Findproduct = User.CartProducts.find((item) => item.ProductID === ProductID)
        res.json({Message : Findproduct})
    }
    catch(error)
    {
        console.error(error);
    }
})

module.exports = router