import { verifyToken } from '../utils/generateToken.js'
import { User } from '../models/index.js'

// Authenticate - Verify JWT token, then load the current user from the DB.
// We look the user up fresh on every request (instead of trusting the role/
// permissions baked into the token) so that permission changes, role
// changes, or deactivation made by an admin take effect immediately instead
// of only after the affected staff member's token expires.
export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  const user = await User.findByPk(decoded.id)
  if (!user || !user.is_active) {
    return res.status(401).json({ error: 'Account is no longer active' })
  }

  req.user = {
    id: user.id,
    email: user.email,
    role: user.role,
    branch_id: user.branch_id,
    permissions: User.getEffectivePermissions(user)
  }
  next()
}

// Authorize - Check role
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

// Authorize - Check a specific permission (e.g. 'manage_appointments').
// Super admin always passes. Everyone else needs the permission to be
// present in their effective permission list (custom overrides, or their
// role's defaults when no custom permissions are set).
export const requirePermission = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (req.user.role === 'super_admin') {
      return next()
    }

    const userPermissions = req.user.permissions || []
    const allowed = requiredPermissions.some((p) => userPermissions.includes(p))

    if (!allowed) {
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