const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const sendEmail = require("../util/email");

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  const { name, email, password, role } = req.body; // include role

  try {
    const hashedPw = await bcrypt.hash(password, 12);

    // Create user data object
    const userData = {
      name,
      email,
      password: hashedPw,
      role: role || "user", // default to 'user' if role not provided
    };

    // ✅ Only add cart for normal users
    if (userData.role !== "admin") {
      userData.cart = { items: [] };
    }

    const user = new User(userData);
    const newUser = await user.save();

    res.status(201).json({
      message: "User created successfully",
      userId: newUser._id.toString(),
      role: newUser.role,
    });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Incorrect password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
        role: user.role, // 👈 IMPORTANT for admin access
      },
      "somesupersecret",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      userId: user._id.toString(),
      role: user.role,
    });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
};

exports.updateUsername = async (req, res, next) => {
  const { userId } = req.params;
  const { name } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, { name }, { new: true });
    res.status(200).json({ message: "Name Updated", user });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
};

exports.requestPasswordReset = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; // 1hr
    await user.save();

    const link = `https://backend-production-fccb.up.railway.app/auth/reset/${token}`;
    await sendEmail(
      user.email,
      "Password Reset Request",
      `
        <h2>Password Reset</h2>
        <p>You asked to reset your password.</p>
        <p>Click the link below to set a new password:</p>
        <a href="${link}">${link}</a>
        <p>This link is valid for 1 hour.</p>
      `
    );

    res.json({ message: "Reset email sent!" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

exports.resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired link" });

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();
    res.json({ message: "Password updated successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update password" });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    res.status(200).json(user);
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted Successfully." });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
};
