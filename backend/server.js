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
import compression from 'compression'
import morgan from 'morgan'
import routes from './src/routes/index.js'
import { errorHandler } from './src/middleware/errorHandler.js'
import sequelize from './src/config/database.js'

const app = express()
const PORT = process.env.PORT || 5000
const isProduction = process.env.NODE_ENV === 'production'

// --- CORS ---
// Local dev ports are always allowed. Production frontend URLs come from
// the CORS_ORIGINS env var (comma-separated), so adding/changing a deployed
// domain is a config change on Render, not a code change.
//   e.g. CORS_ORIGINS=https://lebeza.com,https://admin.lebeza.com
const devOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
]
const envOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

const allowedOrigins = [...devOrigins, ...envOrigins]

if (isProduction && envOrigins.length === 0) {
  console.warn('⚠️  CORS_ORIGINS is not set — only localhost origins are allowed. Your deployed frontend(s) will be blocked by CORS until you set this env var.')
}

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({
  origin: (origin, callback) => {
    // Allow no-origin requests (server-to-server, curl, health checks)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`))
  },
  credentials: true
}))
app.use(compression())
app.use(morgan(isProduction ? 'combined' : 'dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', routes)

app.use(errorHandler)

async function startServer() {
  try {
    await sequelize.authenticate()
    console.log('✅ Database connected successfully!')

    // Auto-sync is convenient in development but risky against a live
    // production database (it can alter/drop columns based on model
    // changes). In production, run `npm run sync` deliberately instead,
    // after reviewing what will change.
    if (isProduction) {
      console.log('ℹ️  Skipping auto-sync in production — run `npm run sync` manually when you change a model.')
    } else {
      await sequelize.sync()
      console.log('✅ Database synced!')
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📡 API base URL: /api`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()