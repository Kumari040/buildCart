const orderRouter = require("express").Router();
const {authMiddleware} = require("../middleware/authMiddleware");
const {adminMiddleware} = require("../middleware/adminMiddleware");
const {orderModel} = require("../models/order");
const {userModel} = require("../models/user");

// Place order
orderRouter.post("/place", authMiddleware, async (req,res)=>{
  const user = await userModel.findById(req.user.id).populate("cart.product");

  let total = 0;
  user.cart.forEach(item=>{
    total += item.quantity * item.product.price;
  });

  const order = await orderModel.create({
    user: user._id,
    products: user.cart,
    totalAmount: total
  });

  user.cart = [];
  await user.save();

  res.json(order);
});

// orders of user
orderRouter.get("/my", authMiddleware, async (req,res)=>{
  const orders = await orderModel.find({user:req.user.id}).populate("products.product");
  res.json(orders);
});

// Admin all orders
orderRouter.get("/all", authMiddleware, adminMiddleware, async (req,res)=>{
  const orders = await orderModel.find().populate("user").populate("products.product");
  res.json(orders);
});

module.exports = {orderRouter};
