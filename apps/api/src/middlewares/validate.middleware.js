const AppError = require("../utils/AppError");

const validate = (schema) => (req, res, next) => {
  const parsed = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!parsed.success) {
    return next(new AppError(parsed.error.issues[0].message, 400));
  }

  req.body = parsed.data.body;
  req.params = parsed.data.params;
  req.query = parsed.data.query;

  next();
};

module.exports = validate;
