import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

// Using MySQL connection
const useConnectionString = !!process.env.DATABASE_URL

// SSL not typically needed for local MySQL
const needsSSL = useConnectionString

const commonOptions = {
  dialect: useConnectionString ? 'postgres' : 'mysql',
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
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || 'root',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        ...commonOptions
      }
    )

export default sequelize