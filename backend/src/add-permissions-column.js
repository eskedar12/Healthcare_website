import { sequelize } from './models/index.js';

async function addPermissionsColumn() {
  try {
    // Check if permissions column exists
    const [results] = await sequelize.query(
      "SHOW COLUMNS FROM users LIKE 'permissions'"
    );

    if (results.length === 0) {
      console.log('Adding permissions column to users table...');
      await sequelize.query(`
        ALTER TABLE users 
        ADD COLUMN permissions JSON NULL 
        AFTER is_active
      `);
      console.log('Permissions column added successfully!');
    } else {
      console.log('Permissions column already exists!');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

addPermissionsColumn();
