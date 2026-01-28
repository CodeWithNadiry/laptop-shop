const express = require("express");
const { body } = require("express-validator");

const isAuth = require("../middleware/isAuth");
const isAdmin = require("../middleware/isAdmin");
const {
  addProduct,
  editProduct,
  deleteProduct,
  getAllUsers,
  deleteUser,
  getProduct,
} = require("../controllers/admin");
const { getAllOrders, updateOrderStatus } = require("../controllers/order");

const router = express.Router();
router.post(
  "/products",
  isAuth,
  isAdmin,
  [body("name").trim().not().isEmpty()],
  addProduct
);

router.get("/products/:prodId", isAuth, isAdmin, getProduct);
router.put(
  "/products/:prodId",
  isAuth,
  isAdmin,
  [body("name").trim().not().isEmpty()],
  editProduct
);
router.put("/orders/:orderId/status", isAuth, isAdmin, updateOrderStatus);

router.delete("/products/:prodId", isAuth, isAdmin, deleteProduct);

router.get("/orders", isAuth, isAdmin, getAllOrders);

router.get("/users", isAuth, isAdmin, getAllUsers);

router.delete("/users/:userId", isAuth, isAdmin, deleteUser);

module.exports = router;
