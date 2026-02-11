/**
 * Run once to create the default admin account.
 * Usage: node seed.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const existing = await User.findOne({ role: "admin" });
    if (existing) {
      console.log("Admin already exists:", existing.email);
    } else {
      const admin = await User.create({
        name: "Admin",
        email: "admin@eventmgmt.com",
        password: "admin123",
        role: "admin",
      });
      console.log("Admin created:", admin.email);
    }

    await mongoose.disconnect();
    console.log("Done.");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedAdmin();
