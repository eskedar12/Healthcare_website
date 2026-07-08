import { verifyToken } from '../utils/generateToken.js'

// Authenticate - Verify JWT token
export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  req.user = decoded
  next()
}

// Authorize - Check role/permission
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' })
    }

    next()
  }
}

// Restrict by branch
export const restrictByBranch = (req, res, next) => {
  if (req.user.branch) {
    req.branchFilter = { branch: req.user.branch }
  } else {
    req.branchFilter = {}
  }
  next()
}