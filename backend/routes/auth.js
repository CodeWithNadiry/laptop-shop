const router = require("express").Router();
const { body } = require("express-validator");
const {
  signup,
  login,
  deleteUser,
  getUser,
  updateUsername,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/auth");
const User = require("../models/user");
const isAuth = require("../middleware/isAuth");

// Auth
router.post(
  "/signup",
  [
    body("name").trim().not().isEmpty(),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom(async (value) => {
        const userDoc = await User.findOne({ email: value });
        if (userDoc) {
          return Promise.reject("E-mail address already exists!");
        }
      })
      .normalizeEmail(),
    body("password").not().isEmpty().trim().isLength({ min: 5 }),
    body("confirmPassword")
      .not()
      .isEmpty()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match!!");
        }
        return true;
      }),
  ],
  signup
);

router.post("/login", login);

// User Profile
router.get("/users/:userId", isAuth, getUser);
router.put("/users/:userId", isAuth, updateUsername);
router.delete("/users/:userId", isAuth, deleteUser);

// Password Reset
router.post("/reset-password", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);
module.exports = router;
