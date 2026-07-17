import { sequelize } from './models/index.js';

// One-off migration, same pattern as add-permissions-column.js — sequelize.sync()
// (without { alter: true }) won't add new columns to a table that already
// exists, so this adds the "image" column doctors now use for their profile
// photo. Safe to run more than once.
async function addDoctorImageColumn() {
  try {
    const [results] = await sequelize.query(
      "SHOW COLUMNS FROM doctors LIKE 'image'"
    );

    if (results.length === 0) {
      console.log('Adding image column to doctors table...');
      await sequelize.query(`
        ALTER TABLE doctors
        ADD COLUMN image VARCHAR(255) NULL
        AFTER phone
      `);
      console.log('Image column added successfully!');
    } else {
      console.log('Image column already exists!');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

addDoctorImageColumn();
