const pickFields = (source, allowedFields) => {
  const picked = {};

  allowedFields.forEach((field) => {
    if (source[field] !== undefined) {
      picked[field] = source[field];
    }
  });

  return picked;
};

module.exports = pickFields;
