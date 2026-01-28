module.exports = (req, res, next) => {
  if (req.userRole !== "admin") {
    const error = new Error("Admin access only.");
    error.statusCode = 403;
    throw error;
  }
  next();
};
