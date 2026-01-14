const productRouter = require("express").Router();
const adminProductRouter = require("express").Router();
const {productModel} = require("../models/product");
const {authMiddleware} = require("../middleware/authMiddleware");
const {adminMiddleware} = require("../middleware/adminMiddleware");

productRouter.get("/", async (req,res)=>{
  const products = await productModel.find();
  res.json(products);
});

adminProductRouter.post("/", authMiddleware, adminMiddleware, async (req,res)=>{
  const { name, price, description, imageUrl, stock } = req.body;
  console.log("BODY:", req.body);
  console.log("USER:", req.user);

  const product = await productModel.create({
    name,
    price,
    description,
    imageUrl,
    stock
  });
  res.json(product);
});

adminProductRouter.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, price, description, imageUrl, stock } = req.body;

    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      { name, price, description, imageUrl, stock },
      { new: true } // return updated doc
    );

    if (!updatedProduct) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(updatedProduct);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update product" });
  }
});

adminProductRouter.delete("/:id", authMiddleware, adminMiddleware, async (req,res)=>{
  await productModel.findByIdAndDelete(req.params.id);
  res.json({msg:"Deleted"});
});

module.exports ={productRouter,adminProductRouter};
