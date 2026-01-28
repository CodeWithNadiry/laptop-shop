const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    resetToken: String,
    resetTokenExpiration: Date,
    cart: {
      type: new mongoose.Schema(
        {
          items: [
            {
              productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
              },
              quantity: { type: Number, required: true, min: 1 },
            },
          ],
        },
      ),
      required: function () {
        return this.role === "user";
      }, // ❌ Only required for users
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.methods.addItem = function (product) {
  if (this.role === "admin") throw new Error("Admins cannot have a cart");
  const updatedCartItems = [...this.cart.items];
  const existingIndex = updatedCartItems.findIndex(
    (item) => item.productId.toString() === product._id.toString()
  );

  existingIndex >= 0 // // Item already exists in cart → increase quantity
    ? updatedCartItems[existingIndex].quantity++
    : updatedCartItems.push({ productId: product._id, quantity: 1 });

  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.removeItem = function (productId) {
  if (this.role === "admin") throw new Error("Admins cannot have a cart");
  this.cart.items = this.cart.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );
  return this.save();
};

userSchema.methods.clearCart = function () {
  if (this.role === "admin") throw new Error("Admins cannot have a cart");
  this.cart.items = [];
  return this.save();
};

module.exports = mongoose.model("User", userSchema);


// 👉 MongoDB automatically gives each event an _id, so no need for uuid now.