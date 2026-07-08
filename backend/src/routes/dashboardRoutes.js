import express from 'express'
import { getDashboardStats } from '../controllers/dashboardController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Protected — admin dashboard only
router.get('/stats', authenticate, getDashboardStats)

export default router
