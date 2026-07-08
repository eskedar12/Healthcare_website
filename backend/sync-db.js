import sequelize from './src/config/database.js'
import models from './src/models/index.js'

const syncDatabase = async () => {
  try {
    // Test connection
    await sequelize.authenticate()
    console.log('✅ Database connection established.')

    // Sync all models (force: true drops and recreates tables)
    // Use force: false to keep existing data
    await sequelize.sync({ force: false, alter: true })
    console.log('✅ All models synchronized successfully.')

    console.log('✅ Database sync completed!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error syncing database:', error)
    process.exit(1)
  }
}

syncDatabase()