const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Create a new user
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, accountType } = req.body;

    //   validate the user input
    if (!fullName || !email || !password || !accountType) {
      return res.status(400).json({ success: false, message: "Please enter all fields" });
    }
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      accountType,
      image: `https://ui-avatars.com/api/?name=${fullName}&background=random&size=200&rounded=true&color=fff&bold=true&font-size=0.33`,
    });

    // Save the user to the database
    await user.save();

    return res.status(200).json({
      success: true,
      user,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log("error registering user", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to SignUp. Please try again" });
  }
};

// Login a user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate the user input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter all fields" });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist.Please Signup and try again.",
      });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ success: false, message: "Invalid Password" });
    }

    return res.status(200).json({
      success: true,
      user,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.log("error logging in user", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to login. Please try again" });
  }
};
