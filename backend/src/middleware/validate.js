import { validationResult } from 'express-validator';
import { sendValidationError } from '../utils/response.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg,
      value: err.value
    }));
    
    return sendValidationError(res, formattedErrors);
  }
  
  next();
};