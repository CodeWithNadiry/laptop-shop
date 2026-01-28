const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  sku: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image: { type: String },
  price: { type: Number },
  regularPrice: Number,
  savings: Number,
  isSale: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  quality: String,
  collection: {
    type: String,
    enum: ["laptops", "monitors", "workstations", "accessories"],
  },
  stock: { type: Number, default: 0 },
});

module.exports = mongoose.model("Product", productSchema);
