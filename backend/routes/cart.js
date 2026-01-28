const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const {
  addToCart,
  removeFromCart,
  clearCart,
  getCart,
} = require("../controllers/cart");

router.post("/", isAuth, addToCart);
router.get("/", isAuth, getCart);
router.delete("/clear", isAuth, clearCart);
router.delete("/:prodId", isAuth, removeFromCart);

module.exports = router;
