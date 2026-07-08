const db = require('./models/index.cjs');

async function testConnection() {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connection successful!');
    
    // Test query
    const users = await db.User.findAll();
    console.log(`✅ Found ${users.length} users`);
    
    const appointments = await db.Appointment.findAll();
    console.log(`✅ Found ${appointments.length} appointments`);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

testConnection();