const express = require("express");
const router = express.Router();

// Import the Product Controllers
const {
  createProduct,
  getAllProducts,
  getSellerProducts,
  getProductDetails,
  getProductsByCategory,
  getProductsByName,
} = require("../controllers/Product");

// Categories Controllers Import
const { createCategory, showAllCategories } = require("../controllers/Category");

// Shop Controllers Import
const { createShop, getAllShopsbyDistrictAndState } = require("../controllers/Shop");

// ********************************************************************************************************
//                                      Product routes
// ********************************************************************************************************

// Create a Product
router.post("/createProduct", createProduct);
// Get All Products
router.get("/getAllProducts", getAllProducts);
// Get All products by a Specific Seller
router.get("/getSellerProducts", getSellerProducts);
// Get product details
router.get("/getProductDetails", getProductDetails);
// Get all products by a specific category
router.get("/getProductsByCategory", getProductsByCategory);
// Get all Products by name -> /api/products/:name
router.get("/getProductsByName", getProductsByName);

// ********************************************************************************************************
//                                      Category routes
// ********************************************************************************************************

// Create a Category
router.post("/createCategory", createCategory);
// Get all Categories
router.get("/showAllCategories", showAllCategories);

// ********************************************************************************************************
//                                      Shop routes
// ********************************************************************************************************

// Create a Shop
router.post("/createShop", createShop);
// Get all shops by state and district
router.get("/getAllShopsbyDistrictAndState", getAllShopsbyDistrictAndState);

module.exports = router;
