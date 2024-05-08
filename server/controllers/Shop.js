const Shop = require("../models/Shop");
const User = require("../models/User");
const Product = require("../models/Product");

// Create a new shop
exports.createShop = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, description, district, state } = req.body;
    const thumbnailImage = req.files.thumbnailImage;

    // Validate the user input
    if (!name || !description || !thumbnailImage || !state || !district) {
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

    // Upload the Thumbnail to Cloudinary
    const image = await uploadImageToCloudinary(thumbnailImage, process.env.FOLDER_NAME);

    // Create a new shop
    const newShop = new Shop({
      name,
      description,
      thumbnailImage: image.secure_url,
      user: req.user._id,
      district,
      state,
    });

    // Save the shop to the database
    await newShop.save();

    // Add the new shop to the User Schema of the Seller
    await User.findByIdAndUpdate(
      {
        _id: sellerDetails._id,
      },
      {
        $push: {
          shops: newShop._id,
        },
      }
    );

    return res.status(201).json({
      success: true,
      message: "Shop created successfully",
      data: newShop,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all shops by state and district
exports.getAllShopsbyDistrictAndState = async (req, res) => {
  try {
    // fetch the state and district from the request body
    const { state, district } = req.body;
    // validate the user input
    if (!state || !district) {
      return res.status(400).json({ success: false, message: "Please enter all fields" });
    }
    // fetch all the shops by state and district
    const allShops = await Shop.find({ state, district }).populate("seller").exec();
    return res
      .status(200)
      .json({ success: true, data: allShops, msg: "All shops fetched successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      msg: "Shops are not fetched. Try Again",
    });
  }
};
