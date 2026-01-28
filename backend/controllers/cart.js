const Product = require("../models/product");
const User = require("../models/user");

// Add a product to cart
exports.addToCart = async (req, res, next) => {
  const { prodId } = req.body;
  try {
    const product = await Product.findById(prodId);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    if (req.userRole === "admin") {
      return res.status(403).json({ message: "Admins cannot use cart" });
    }

    await user.addItem(product);

    res.status(200).json({
      success: true,
      data: {},
      message: "Added to cart",
    });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
};

// Remove one product from cart
exports.removeFromCart = async (req, res, next) => {
  const { prodId } = req.params;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const itemExists = user.cart.items.some(
      (item) => item.productId.toString() === prodId
    );

    if (!itemExists) {
      return res.status(404).json({
        data: {},
        message: "Item not found in cart",
      });
    }

    await user.removeItem(prodId);

    res.status(200).json({
      success: true,
      data: {},
      message: "Item removed from cart",
    });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
};

// Clear all items in cart
exports.clearCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    await user.clearCart();

    res.status(200).json({
      success: true,
      data: {},
      message: "Cart cleared",
    });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
};

// Get current cart
exports.getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate(
      "cart.items.productId"
    );
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: { cart: user.cart },
      message: "Cart fetched successfully",
    });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
};
