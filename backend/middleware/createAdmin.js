const User = require("../models/user");
const bcrypt = require("bcryptjs");

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });

    if (adminExists) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 12); // default password

    await User.create({
      name: "AdminNadiry",
      email: "admin@dellshop.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully");
  } catch (err) {
    console.log("Error creating admin:", err);
  }
};

module.exports = createAdmin;
