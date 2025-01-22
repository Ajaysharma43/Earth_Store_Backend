const express = require("express");
const Router = express.Router();
const Data = require('../Schemma/DataSchemma')

const app = express();


Router.post("/Data", async (req, res) => {
    const {name , type , price , image , description} = req.body;
    const Products = {Name:name,Type:type,Price:price,Image:image,Description:description}
    const dataset = new Data(Products);
    const datasave = await dataset.save();
});

module.exports = Router;
