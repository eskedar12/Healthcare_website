import { User, Branch } from '../models/index.js'
import { hashPassword, comparePassword } from '../utils/hashPassword.js'
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/generateToken.js'

const publicUser = (user) => {
  const json = user.toJSON()
  delete json.password
  return {
    ...json,
    permissions: User.getEffectivePermissions(user),
    avatar: json.full_name ? json.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : ''
  }
}

export const register = async (userData) => {
  const { email, password } = userData

  const existingUser = await User.findOne({ where: { email } })
  if (existingUser) {
    throw new Error('A user with this email already exists')
  }

  const hashedPassword = await hashPassword(password)

  const user = await User.create({
    ...userData,
    password: hashedPassword
  })

  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  return {
    user: publicUser(user),
    token: accessToken,
    refreshToken
  }
}

export const login = async (email, password) => {
  const user = await User.findOne({ where: { email }, include: ['branch'] })

  if (!user) {
    throw new Error('Invalid credentials')
  }

  if (!user.is_active) {
    throw new Error('Account is deactivated')
  }

  const isMatch = await comparePassword(password, user.password)
  if (!isMatch) {
    throw new Error('Invalid credentials')
  }

  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  return {
    user: publicUser(user),
    token: accessToken,
    refreshToken
  }
}

export const refreshAccessToken = async (refreshToken) => {
  const decoded = verifyToken(refreshToken)
  if (!decoded) {
    throw new Error('Invalid or expired refresh token')
  }

  const user = await User.findByPk(decoded.id)
  if (!user || !user.is_active) {
    throw new Error('Invalid or expired refresh token')
  }

  const accessToken = generateAccessToken(user)
  return { token: accessToken }
}

export const getCurrentUser = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
    include: ['branch']
  })

  if (!user) {
    throw new Error('User not found')
  }

  return publicUser(user)
}

// Stateless JWT logout: there is no server-side session to invalidate.
// This exists as an endpoint for the client to call so it has a clean
// place to clear its stored tokens; if you need real invalidation later,
// back this with a token blacklist or short-lived access tokens + rotation.
export const logout = async () => {
  return true
}