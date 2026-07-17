import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import sequelize from './src/config/database.js'
import models from './src/models/index.js'

// Load env vars
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

// Middleware
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
import routes from './src/routes/index.js'
app.use('/api', routes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  })
})

// Try syncing models with a retry for transient deadlocks
const syncModelsWithRetry = async (attempts = 3, delayMs = 1000) => {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await sequelize.sync({ alter: true })
      console.log('✅ Models synchronized.')
      return
    } catch (error) {
      const isDeadlock = error.parent?.errno === 1213 || error.parent?.sqlState === '40001' || /Deadlock found/.test(error.message)
      const isDuplicateKeys = error.parent?.errno === 1069 || /Too many keys specified/.test(error.message)

      if (isDuplicateKeys) {
        console.warn('⚠️ Model sync ALTER failed due to existing indexes. Falling back to plain sync without alter.')
        await sequelize.sync()
        console.log('✅ Models synchronized with plain sync.')
        return
      }

      if (!isDeadlock || attempt === attempts) {
        throw error
      }
      console.warn(`⚠️ Deadlock during sync attempt ${attempt}, retrying in ${delayMs}ms...`)
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }
}

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate()
    console.log('✅ Database connection established.')

    // Sync models with retries for transient deadlocks
    await syncModelsWithRetry()

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

export default app