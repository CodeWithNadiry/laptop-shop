const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth"); // your auth middleware
const {placeOrder, getUserOrder, getInvoice} = require("../controllers/order");

router.post("/", isAuth, placeOrder);

router.get('/', isAuth, getUserOrder)

router.get('/:orderId/invoice', isAuth,  getInvoice)
module.exports = router;