const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const Order = require("../models/order");
const User = require("../models/user");
const sendEmail = require("../util/email");

// -----------------------------
// Place Order (Cash on Delivery)
// -----------------------------
exports.placeOrder = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate(
      "cart.items.productId"
    );

    if (!user) throw new Error("User not found");
    if (!user.cart.items.length) throw new Error("Cart is empty");

    const totalAmount = user.cart.items.reduce(
      (acc, item) => acc + item.productId.price * item.quantity,
      0
    );

    const order = new Order({
      user: user._id,
      items: user.cart.items.map((i) => ({
        productId: i.productId._id,
        name: i.productId.name,
        price: i.productId.price,
        image: i.productId.image,
        quantity: i.quantity,
      })),
      totalAmount,
      status: "Pending",
    });

    await order.save();
    await user.clearCart();

    // ---------- SEND EMAIL ----------
    const itemsHtml = order.items
      .map(
        (item) =>
          `<li>${item.name} - Qty: ${item.quantity} - Rs ${item.price}</li>`
      )
      .join("");

    const emailHtml = `
      <h2>Thank you for your order!</h2>
      <p>Order ID: <strong>${order._id.toString().slice(-5)}</strong></p>
      <p>Order Summary:</p>
      <ul>
        ${itemsHtml}
      </ul>
      <p><strong>Total Amount: Rs ${order.totalAmount}</strong></p>
      <p>We will notify you once your order is shipped.</p>
      <p>— Nadiry Store</p>
    `;

    try {
      await sendEmail(user.email, "Your Order Confirmation", emailHtml);
    } catch (err) {
      console.log("Email error:", err.message);
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully (Cash on Delivery). Email sent!",
      data: { order },
    });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
};

// -----------------------------
// Update Order Status (Admin)
// -----------------------------
// -----------------------------
// Update Order Status (Admin)
// -----------------------------
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body; // example: "Shipped"

    const order = await Order.findById(orderId).populate("user");
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    // ---------- SEND EMAIL ON STATUS CHANGE ----------
    const emailHtml = `
      <h2>Your order status has been updated!</h2>
      <p>Order ID: <strong>${order._id.toString().slice(-5)}</strong></p>
      <p>New Status: <strong>${status}</strong></p>
      <p>Order Summary:</p>
      <ul>
        ${order.items
          .map(
            (item) =>
              `<li>${item.name} - Qty: ${item.quantity} - Rs ${item.price}</li>`
          )
          .join("")}
      </ul>
      <p><strong>Total Amount: Rs ${order.totalAmount}</strong></p>
      <p>Thank you for shopping with Nadiry Store!</p>
    `;

    try {
      await sendEmail(order.user.email, `Order ${status}`, emailHtml);
      console.log(`Email sent to ${order.user.email} about status: ${status}`);
    } catch (err) {
      console.log("Email error:", err.message);
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status} and email sent successfully`,
      order,
    });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
};

// -----------------------------
// Get User Orders
// -----------------------------
exports.getUserOrder = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .lean(); // convert to plain JS object for easy manipulation

    // Convert _id to string to avoid slice errors
    const ordersWithStringId = orders.map((order) => ({
      ...order,
      _id: order._id.toString(),
    }));

    res.status(200).json({
      success: true,
      message: "User orders fetched successfully",
      data: { orders: ordersWithStringId },
    });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
};

// -----------------------------
// Get All Orders (Admin)
// -----------------------------
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user", "-password -resetPasswordToken -resetPasswordExpires")
      .sort({ createdAt: -1 })
      .lean();

    const ordersWithStringId = orders.map((order) => ({
      ...order,
      _id: order._id.toString(),
    }));

    res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      orders: ordersWithStringId,
    });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
};

// -----------------------------
// Generate Professional Invoice PDF
// -----------------------------
exports.getInvoice = async (req, res, next) => {
  const orderId = req.params.orderId;

  try {
    const order = await Order.findById(orderId).populate("user");
    if (!order)
      throw Object.assign(new Error("Order not found"), { statusCode: 404 });

    if (order.user._id.toString() !== req.userId.toString()) {
      throw Object.assign(new Error("Unauthorized access"), {
        statusCode: 403,
      });
    }

    const invoiceName = `invoice-${orderId}.pdf`;
    const invoicePath = path.join("data", "invoices", invoiceName);

    const pdfDoc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);

    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);

    // Header
    pdfDoc
      .fontSize(28)
      .fillColor("#333")
      .text("Nadiry Store", { align: "center" })
      .moveDown(0.5);
    pdfDoc
      .fontSize(12)
      .fillColor("#555")
      .text("Email: support@nadiryshop.com | Phone: +92 300 1234567", {
        align: "center",
      })
      .moveDown(2);

    // Invoice title
    pdfDoc
      .fontSize(20)
      .fillColor("#000")
      .text("Invoice", { underline: true })
      .moveDown(1);

    // User details
    pdfDoc
      .fontSize(12)
      .text(`Customer Name: ${order.user.name}`)
      .text(`Email: ${order.user.email}`)
      .text(`Invoice ID: ${orderId}`)
      .text(`Order Date: ${order.createdAt.toDateString()}`)
      .moveDown(2);

    // Table header
    pdfDoc
      .fontSize(14)
      .fillColor("#333")
      .text("Product", 50, pdfDoc.y, { width: 220 })
      .text("Qty", 270, pdfDoc.y, { width: 80 })
      .text("Price", 350, pdfDoc.y, { width: 100 })
      .text("Total", 450, pdfDoc.y, { width: 100 })
      .moveTo(50, pdfDoc.y + 2)
      .lineTo(560, pdfDoc.y + 2)
      .stroke()
      .moveDown(1);

    // Items
    let total = 0;
    order.items.forEach((item) => {
      const itemTotal = item.quantity * item.price;
      total += itemTotal;

      pdfDoc
        .fontSize(12)
        .fillColor("#000")
        .text(item.name, 50, pdfDoc.y)
        .text(item.quantity.toString(), 270, pdfDoc.y)
        .text(`Rs. ${item.price}`, 350, pdfDoc.y)
        .text(`Rs. ${itemTotal}`, 450, pdfDoc.y)
        .moveDown();
    });

    pdfDoc.moveDown();
    pdfDoc
      .fontSize(16)
      .fillColor("#000")
      .text("------------------------------", { align: "right" })
      .text(`Total Amount: Rs. ${total}`, { align: "right" })
      .text("------------------------------", { align: "right" })
      .moveDown(3);

    // Footer
    pdfDoc
      .fontSize(12)
      .fillColor("#777")
      .text("Thank you for shopping with Nadiry Store! 🛍️", { align: "center" })
      .text("For any support, contact us anytime.", { align: "center" });

    pdfDoc.end();
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
};
