// Response Standardization Middleware
export const standardResponse = (req, res, next) => {
  // Add standardized response methods
  res.success = (data, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
      success: true,
      message,
      data
    });
  };

  res.error = (message = 'Error', statusCode = 500, data = null) => {
    res.status(statusCode).json({
      success: false,
      message,
      data
    });
  };

  next();
};

// Request Validation Middleware
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body || {});
    if (error) {
      return res.error(
        error.details[0].message,
        400
      );
    }
    next();
  };
};

// Safe Destructuring Helper
export const safeDestructure = (obj) => {
  return obj || {};
};
