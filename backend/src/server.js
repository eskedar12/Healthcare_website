require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const sequelize = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://lebeza-frontend.onrender.com'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handler (must be last)
app.use(errorHandler);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully!');

    await sequelize.sync();
    console.log('✅ Database synced!');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 API base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();