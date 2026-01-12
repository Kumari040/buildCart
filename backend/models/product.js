const mongoose= require("mongoose");
const Schema= mongoose.Schema;

const productSchema = new Schema({
    name:String,
    price:Number,
    description:String,
    imageUrl:String,
    stock:Number
});
const productModel= mongoose.model("products",productSchema);
module.exports={productModel};
