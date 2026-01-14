// createAdmin.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { userModel } = require("./models/user");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

async function createAdmin() {
  const hashedPassword = await bcrypt.hash("admin123", 10); // password you want

  const admin = new userModel({
    name: "Admin User",
    email: "admin@shop.com",
    password: hashedPassword,
    role: "admin"
  });

  try {
    await admin.save();
    console.log("Admin created successfully!");
  } catch (err) {
    console.error("Error creating admin:", err.message);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();
