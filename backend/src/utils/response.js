// Standard API response utilities
// Convention used across this codebase: sendSuccess(res, message, data, statusCode)

export const sendSuccess = (res, message = 'Success', data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  })
}

export const sendCreated = (res, message = 'Created successfully', data = null) => {
  return sendSuccess(res, message, data, 201)
}

export const sendError = (res, message = 'Something went wrong', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  })
}

export const sendValidationError = (res, errors, message = 'Validation failed') => {
  return sendError(res, message, 422, errors)
}

export const sendBadRequest = (res, message = 'Bad request') => {
  return sendError(res, message, 400)
}

export const sendUnauthorized = (res, message = 'Unauthorized') => {
  return sendError(res, message, 401)
}

export const sendForbidden = (res, message = 'Forbidden') => {
  return sendError(res, message, 403)
}

export const sendNotFound = (res, message = 'Resource not found') => {
  return sendError(res, message, 404)
}
