const productRouter = require("express").Router();
const {productModel} = require("../models/product");
const {authMiddleware} = require("../middleware/authMiddleware");
const {adminMiddleware} = require("../middleware/adminMiddleware");

productRouter.get("/", async (req,res)=>{
  const products = await productModel.find();
  res.json(products);
});

productRouter.post("/", authMiddleware, adminMiddleware, async (req,res)=>{
  const product = await productModel.create({
    name,
    price,
    description,
    imageUrl,
    stock
  });
  res.json(product);
});

productRouter.delete("/:id", authMiddleware, adminMiddleware, async (req,res)=>{
  await productModel.findByIdAndDelete(req.params.id);
  res.json({msg:"Deleted"});
});

module.exports ={productRouter};
