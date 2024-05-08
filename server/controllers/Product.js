const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User");
const Shop = require("../models/Shop");
const { uploadImageToCloudinary } = require("../utils/imageUploder");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, price, category, countInStock } = req.body;

    const image = req.files.image;

    // Validate the user input
    if (!name || !description || !image || !price || !category || !countInStock) {
      return res.status(400).json({ success: false, message: "Please enter all fields" });
    }

    // Check if the user is an seller
    const sellerDetails = await User.findById(userId, {
      accountType: "Seller",
    });

    if (!sellerDetails) {
      return res.status(404).json({
        success: false,
        message: "Seller Details Not Found",
      });
    }

    // Check if the category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ success: false, message: "Category does not exist" });
    }

    // Upload the Thumbnail to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(image, process.env.FOLDER_NAME);
    console.log(thumbnailImage);

    // Create a new product
    const newproduct = new Product({
      name,
      description,
      price,
      category,
      countInStock,
      image: thumbnailImage.secure_url,
      user: req.user._id,
    });

    // Save the product to the database
    await newproduct.save();

    // Add the new course to the User Schema of the Seller
    await User.findByIdAndUpdate(
      {
        _id: sellerDetails._id,
      },
      {
        $push: {
          products: newproduct._id,
        },
      },
      { new: true }
    );

    //  Add the new Product to the Categories
    const categoryDetails2 = await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          products: newproduct._id,
        },
      },
      { new: true }
    );
    console.log("HEREEEEEEEE", categoryDetails2);

    return res.status(200).json({
      success: true,
      newproduct,
      message: "Product created successfully",
    });
  } catch (error) {
    console.log("error creating product", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create product. Please try again" });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find(
      {},
      { name: true, price: true, image: true, seller: true }
    )
      .populate("seller")
      .exec();
    return res.status(200).json({ success: true, data: allProducts });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Product Data`,
      error: error.message,
    });
  }
};

// Get All products by a Specific Seller
exports.getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const sellerProducts = await Course.find({
      seller: sellerId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: sellerProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve Seller Products",
      error: error.message,
    });
  }
};

// Get all products by a specific category
exports.getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category }).populate("category").exec();
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Product Data`,
      error: error.message,
    });
  }
};

// Get all Products by name -> /api/products/:name
exports.getProductsByName = async (req, res) => {
  try {
    const name = req.params.name;
    const products = await Product.find({ name }).populate("category").exec();
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Product Data`,
      error: error.message,
    });
  }
};

// Get product details
exports.getProductDetails = async () => {
  try {
    const { productId } = req.body;
    const productDetails = await Product.findOne({ _id: productId })
      .populate("seller")
      .populate("category")
      .exec();

    if (!productDetails) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: productDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Product Data`,
      error: error.message,
    });
  }
};
