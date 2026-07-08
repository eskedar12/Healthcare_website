import dotenv from 'dotenv';
import { User } from '../models/index.js';
import sequelize from '../config/database.js';
import { hashPassword } from '../utils/hashPassword.js';

dotenv.config();

const createInitialAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected for seeding');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@healthcare.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const adminName = process.env.ADMIN_FULL_NAME || 'Super Admin';

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log('⚠️ Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await hashPassword(adminPassword);
    const admin = await User.create({
      full_name: adminName,
      email: adminEmail,
      phone_number: '0000000000',
      password: hashedPassword,
      role: 'super_admin',
      is_active: true
    });

    console.log('✅ Super Admin created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('⚠️  Please change the default password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
};

createInitialAdmin();