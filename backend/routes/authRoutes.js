const express=require('express');
const authRouter=express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {userModel} = require("../models/user");
const {jwt_key}=require("../config/auth");
// Register
authRouter.post("/register", async (req,res)=>{
  const {name,email,password} = req.body;
  try{
    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "User already exists" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await userModel.create({name,email,password:hashed,role:"user"});
    res.json({msg:"Registered successfully"});
  } catch {
    res.status(400).json({msg:"User exists"});
  }
});

// Login
authRouter.post("/login", async (req,res)=>{
  const {email,password} = req.body;
  const user = await userModel.findOne({email});
  if(!user) return res.status(400).json({msg:"Invalid credentials"});

  const match = await bcrypt.compare(password, user.password);
  if(!match) return res.status(400).json({msg:"Invalid credentials"});

  const token = jwt.sign(
    {id:user._id, role:user.role},
    jwt_key,
    {expiresIn:"1d"}
  );

  res.json({token, role:user.role, name:user.name});
});

module.exports = {authRouter};