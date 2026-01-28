const router = require("express").Router();
const {
  getProducts,
  getProductsByCollection,
  getProductBySlug,
} = require("../controllers/product");

// Optional: all products API
router.get("/products", getProducts);

// Collection listing page
router.get(
  "/collections/:collectionSlug/products",
  getProductsByCollection
);

// Product detail page (SEO URL)
router.get(
  "/collections/:collectionSlug/products/:productSlug",
  getProductBySlug
);

module.exports = router;
