const { validationResult } = require("express-validator");
const Product = require("../models/product");
const slugify = require("slugify");
const deleteFile = require("../util/file");
const User = require("../models/user");

// ➕ Add Product
exports.addProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error("No image provided");
    error.statusCode = 422;
    throw error;
  }

  let {
    name,
    description,
    price,
    regularPrice,
    isSale,
    isFeatured,
    quality,
    collection,
    stock,
  } = req.body;

  isSale = isSale === "true" || isSale === true;
  isFeatured = isFeatured === "true" || isFeatured === true;

  const slug = slugify(name, { lower: true, strict: true });
  const sku = `SKU-${Date.now()}`;
  const image = req.file.path.replace("\\", "/");

  const savings = isSale && regularPrice ? regularPrice - price : undefined;

  const product = new Product({
    name,
    slug,
    sku,
    description,
    image,
    price,
    regularPrice: isSale ? regularPrice : undefined,
    savings,
    isSale,
    isFeatured,
    quality,
    collection,
    stock,
  });

  await product.save();

  res.status(201).json({
    success: true,
    message: "Product added successfully",
    data: product,
  });
};

exports.getProduct = async (req, res, next) => {
  try {
    const { prodId } = req.params;
    const product = await Product.findById(prodId);

    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      product: product,
      message: "Product fetched successfully",
    });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
};

// ✏ Edit Product
exports.editProduct = async (req, res, next) => {
  const prodId = req.params.prodId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    throw error;
  }

  let {
    name,
    description,
    price,
    regularPrice,
    isSale,
    isFeatured,
    quality,
    collection,
    stock,
  } = req.body;

  isSale = isSale === "true" || isSale === true;
  isFeatured = isFeatured === "true" || isFeatured === true;

  const product = await Product.findById(prodId);
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  if (req.file) {
    deleteFile(product.image);
    product.image = req.file.path.replace("\\", "/");
  }

  product.name = name;
  product.slug = slugify(name, { lower: true, strict: true });
  product.description = description;
  product.price = price;
  product.regularPrice = isSale ? regularPrice : undefined;
  product.savings = isSale && regularPrice ? regularPrice - price : undefined;
  product.isSale = isSale;
  product.isFeatured = isFeatured;
  product.quality = quality;
  product.collection = collection;
  product.stock = stock;

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
};

// 🗑 Delete Product
exports.deleteProduct = async (req, res, next) => {
  const prodId = req.params.prodId;

  const product = await Product.findById(prodId);
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  deleteFile(product.image);
  await Product.findByIdAndDelete(prodId);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ users });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
};


exports.deleteUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
};
