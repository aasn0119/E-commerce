const mongoose = require("mongoose");

// Define the Product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: "Category",
  },
  countInStock: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
