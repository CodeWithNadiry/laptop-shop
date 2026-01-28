const Product = require("../models/product");

// Get all products
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      data: products,
      message: "Products fetched successfully",
    });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
};

// Get products by collection (brand/subcategory)
exports.getProductsByCollection = async (req, res, next) => {
  try {
    const { collectionSlug } = req.params;
    const products = await Product.find({ collection: collectionSlug });
    res.status(200).json({
      success: true,
      data: products,
      message: "Collection products fetched successfully",
    });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
};

// Get single product by slug (SEO friendly)
exports.getProductBySlug = async (req, res, next) => {
  try {
    const { productSlug, collectionSlug } = req.params;

    const product = await Product.findOne({
      slug: productSlug,
      collection: collectionSlug,
    });

    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: product,
      message: "Product fetched successfully",
    });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
};
