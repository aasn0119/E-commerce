const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL).then(() => {
      console.log("Connected to MongoDB");
    });
  } catch (err) {
    console.error(err.message);
    console.log("Failed to connect to MongoDB, exiting...");
    process.exit(1);
  }
};

module.exports = connectDB;
