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
        product: { type:Schema.Types.ObjectId, ref:"products" },
        quantity: Number
    }
    ]
});

userSchema.pre("save", async function(){
  if(!this.isModified("password")) return ;
  if (!this.password.startsWith("$2b$")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

const userModel=mongoose.model("user",userSchema);

module.exports={userModel};
