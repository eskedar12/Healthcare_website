import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

// Render (and most managed Postgres hosts) provide one connection string
// via DATABASE_URL instead of separate host/user/password vars. Locally,
// DATABASE_URL is usually unset, so we fall back to the individual
// DB_* vars from .env.
const useConnectionString = !!process.env.DATABASE_URL

// Render's internal Postgres connection doesn't require SSL, but its
// external connection string does. NODE_ENV=production is the signal
// we use to turn SSL on; set PGSSL=false to force it off if needed.
const needsSSL = process.env.NODE_ENV === 'production' && process.env.PGSSL !== 'false'

const commonOptions = {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  dialectOptions: needsSSL
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {}
}

const sequelize = useConnectionString
  ? new Sequelize(process.env.DATABASE_URL, commonOptions)
  : new Sequelize(
      process.env.DB_NAME || 'healthcare',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        ...commonOptions
      }
    )

export default sequelize
