const AppError = require("../utils/AppError");

const restrictTo = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError("You do not have permission for this action", 403));
  }

  next();
};

module.exports = restrictTo;
