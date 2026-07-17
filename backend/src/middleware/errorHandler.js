export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message,
      value: e.value
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors,
      timestamp: new Date().toISOString()
    });
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: `${e.path} already exists`,
      value: e.value
    }));
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry',
      errors,
      timestamp: new Date().toISOString()
    });
  }
// Multer upload error (bad file type, too large, etc.)
if (err.name === 'MulterError' || /only jpg, png, webp, or gif/i.test(err.message || '')) {
  return res.status(400).json({
    success: false,
    message: err.code === 'LIMIT_FILE_SIZE' ? 'Image must be 5MB or smaller' : err.message,
    timestamp: new Date().toISOString()
  });
}
  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      timestamp: new Date().toISOString()
    });
  }

  // Default error
  // Note: the service layer mostly throws plain `new Error('...')` without an
  // explicit statusCode, so infer a reasonable one from the message. If you
  // add new error cases, prefer setting `err.statusCode` explicitly at the
  // throw site instead of relying on this.
  let statusCode = err.statusCode;
  if (!statusCode) {
    const msg = err.message || '';
    if (/not found/i.test(msg)) statusCode = 404;
    else if (/already exists/i.test(msg)) statusCode = 409;
    else if (/invalid credentials|invalid or expired/i.test(msg)) statusCode = 401;
    else if (/deactivated|insufficient|forbidden/i.test(msg)) statusCode = 403;
    else if (/cannot |already cancelled|already completed/i.test(msg)) statusCode = 400;
    else statusCode = 500;
  }
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString()
  });
};