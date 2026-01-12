const mongoose= require("mongoose");
const Schema= mongoose.Schema;
const orderSchema = new Schema({
 user: { type: Schema.Types.ObjectId, ref:"User" },
 products: [
   { product: { type: Schema.Types.ObjectId, ref:"Product" }, quantity:Number }
 ],
 totalAmount:Number,
 createdAt:{ type:Date, default:Date.now }
});

const orderModel= mongoose.model('orders',orderSchema);
module.exports={orderModel};