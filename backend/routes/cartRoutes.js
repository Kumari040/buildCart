const cartRouter = require("express").Router();
const {authMiddleware} = require("../middleware/authMiddleware");
const {userModel} = require("../models/user");

cartRouter.get("/", authMiddleware, async (req,res)=>{
  const user = await userModel.findById(req.user.id).populate("cart.product");
  res.json(user.cart);
});

cartRouter.post("/add", authMiddleware, async (req,res)=>{
  const {productId} = req.body;
  const user = await userModel.findById(req.user.id);

  const item = user.cart.find(i => i.product.toString() === productId);
  if(item) item.quantity++;
  else user.cart.push({product:productId, quantity:1});

  await user.save();
  res.json({msg:"item added to cart"});
  
});

cartRouter.put("/update", authMiddleware, async (req,res)=>{
  const {productId, quantity} = req.body;
  const user = await userModel.findById(req.user.id);
  const item = user.cart.find(i => i.product.toString() === productId);
  if(item) item.quantity = quantity;
  await user.save();
  res.json(user.cart);
});

cartRouter.delete("/remove/:id", authMiddleware, async (req,res)=>{
  const user = await userModel.findById(req.user.id);
  user.cart = user.cart.filter(i => i.product.toString() !== req.params.id);
  await user.save();
  res.json(user.cart);
});

module.exports = {cartRouter};
