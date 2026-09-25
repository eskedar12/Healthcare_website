import dotenv from 'dotenv'
dotenv.config()

import dns from 'node:dns'
// Windows machines frequently have broken/unreachable IPv6 routing. Node's
// default DNS resolution tries IPv6 first, so every connection attempt to
// Neon times out (ETIMEDOUT / AggregateError) before it ever falls back to
// IPv4. Forcing IPv4-first fixes this without touching anything else.
dns.setDefaultResultOrder('ipv4first')

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import routes from './src/routes/index.js'
import { errorHandler } from './src/middleware/errorHandler.js'
import sequelize from './src/config/database.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001',
  ],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', routes)

app.use(errorHandler)

async function startServer() {
  try {
    await sequelize.authenticate()
    console.log('✅ Database connected successfully!')

    await sequelize.sync()
    console.log('✅ Database synced!')

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
      console.log(`📡 API base URL: http://localhost:${PORT}/api`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()