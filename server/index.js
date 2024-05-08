const express = require("express");
const app = express();

const authRoutes = require("./routes/Auth");
const productRoutes = require("./routes/Product");

const dbConnect = require("./config/database");
const fileUpload = require("express-fileupload");
const { cloudinaryConnect } = require("./config/cloudinary");

require("dotenv").config();
const PORT = process.env.PORT || 8000;

// Database Connection
dbConnect();

// Middlewares
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// Cloudinary Connection
cloudinaryConnect();

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);

// Default Route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
