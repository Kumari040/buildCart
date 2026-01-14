
const {jwt_key}=require('../config/auth');
const jwt=require('jsonwebtoken');
const { userModel } = require('../models/user');

async function authMiddleware(req,res,next){
    
    try{
        const token=req.headers.authorization;
        if(!token){
            return res.status(401).json({
                error:"no token"
            })
        }

        const decoded=jwt.verify(token,jwt_key);
        const user=await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user=decoded;
        return next();
    }catch(err){
        return res.status(401).json({
            error:"Invalid token"
        });
    }
}
module.exports={
    authMiddleware
};