// This file will centralize all routes
import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import appointmentRoutes from './appointmentRoutes.js';
import branchRoutes from './branchRoutes.js';
import doctorRoutes from './doctorRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import contentRoutes from './contentRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import inquiryRoutes from './inquiryRoutes.js';

const router = express.Router();

// Public routes (no auth needed)
router.use('/auth', authRoutes);

// Public contact form submissions (route itself protects list/update with auth)
router.use('/inquiries', inquiryRoutes);

// Public departments list
router.get('/departments', (req, res) => {
  res.json({
    success: true,
    message: 'Departments retrieved successfully',
    data: {
      departments: [
        { id: 'adult-psychiatry', name: 'Adult Psychiatry' },
        { id: 'child-adolescent', name: 'Child & Adolescent' },
        { id: 'psychology', name: 'Clinical Psychology' },
        { id: 'psychotherapy', name: 'Psychotherapy' }
      ]
    }
  });
});

// Protected routes (auth required)
router.use('/users', userRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/branches', branchRoutes);
router.use('/doctors', doctorRoutes);
router.use('/services', serviceRoutes);
router.use('/content', contentRoutes);
router.use('/dashboard', dashboardRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default router;