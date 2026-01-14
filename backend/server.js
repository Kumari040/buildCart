const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const {authRouter}=require("./routes/authRoutes");
const {cartRouter}= require("./routes/cartRoutes");
const {productRouter,adminProductRouter} = require("./routes/productRoutes");
const {orderRouter} = require("./routes/orderRoutes");
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/admin/products", adminProductRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders",orderRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log("Server running on " + PORT));
