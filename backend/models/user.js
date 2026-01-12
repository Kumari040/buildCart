const mongoose= require("mongoose");
const Schema= mongoose.Schema;
const bcrypt= require("bcrypt");
const userSchema = new Schema({
    name: String,
    email: { type:String, unique:true },
    password: String,
    role: { type:String, enum:["user","admin"], default:"user" },
    cart: [
    {
        product: { type:Schema.Types.ObjectId, ref:"Product" },
        quantity: Number
    }
    ]
});

userSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const userModel=mongoose.model("user",userSchema);

module.exports={userModel};
