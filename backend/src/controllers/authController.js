import {
  register as registerService,
  login as loginService,
  refreshAccessToken,
  getCurrentUser,
  logout as logoutService
} from '../services/authService.js'
import { sendSuccess, sendCreated, sendUnauthorized } from '../utils/response.js'

export const register = async (req, res, next) => {
  try {
    const result = await registerService(req.body)
    sendCreated(res, 'User registered successfully', result)
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const result = await loginService(email, password)
    sendSuccess(res, 'Login successful', result)
  } catch (error) {
    if (error.message === 'Invalid credentials' || error.message === 'Account is deactivated') {
      return sendUnauthorized(res, error.message)
    }
    next(error)
  }
}

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    const result = await refreshAccessToken(refreshToken)
    sendSuccess(res, 'Token refreshed successfully', result)
  } catch (error) {
    if (error.message === 'Invalid or expired refresh token') {
      return sendUnauthorized(res, error.message)
    }
    next(error)
  }
}

export const getMe = async (req, res, next) => {
  try {
    const user = await getCurrentUser(req.user.id)
    sendSuccess(res, 'User fetched successfully', user)
  } catch (error) {
    next(error)
  }
}

export const logout = async (req, res, next) => {
  try {
    await logoutService()
    sendSuccess(res, 'Logged out successfully')
  } catch (error) {
    next(error)
  }
}
