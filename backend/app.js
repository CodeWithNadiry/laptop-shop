const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const app = express();
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/avif" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(express.json());
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(cors({
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const userRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/", productRoutes);
app.use("/cart", userRoutes);
app.use("/orders", orderRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message || "Something went wrong";
  const data = error.data || null;
  res.status(status).json({ message, data });
});

const createAdmin = require("./middleware/createAdmin");
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    // Create admin only if it doesn't exist
    createAdmin();

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, "0.0.0.0", () => {
      console.log("🚀 Server running on port " + PORT);
    });
  })
  .catch((err) => console.log(err));
