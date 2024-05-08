const mongoose = require("mongoose");

// Define the user schema using the Mongoose Schema constructor
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["Customer", "Seller"],
    required: true,
  },
  shops: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
  ],
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  image: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
