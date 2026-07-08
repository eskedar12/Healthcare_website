import dotenv from 'dotenv';
import { User } from '../models/index.js';
import sequelize from '../config/database.js';
import { hashPassword } from '../utils/hashPassword.js';

dotenv.config();

// Creates the two extra front-desk / editorial accounts, if they don't
// already exist. Safe to run more than once — existing users are skipped.
const roleUsersToSeed = [
  {
    envPrefix: 'RECEPTION',
    role: 'reception_officer',
    defaultEmail: 'reception@lebeza.com',
    defaultPassword: 'Reception@123',
    defaultName: 'Reception Officer'
  },
  {
    envPrefix: 'CONTENT_EDITOR',
    role: 'content_editor',
    defaultEmail: 'editor@lebeza.com',
    defaultPassword: 'Editor@123',
    defaultName: 'Content Editor'
  }
];

const seedRoleUsers = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected for seeding');

    for (const config of roleUsersToSeed) {
      const email = process.env[`${config.envPrefix}_EMAIL`] || config.defaultEmail;
      const password = process.env[`${config.envPrefix}_PASSWORD`] || config.defaultPassword;
      const fullName = process.env[`${config.envPrefix}_FULL_NAME`] || config.defaultName;

      const existing = await User.findOne({ where: { email } });
      if (existing) {
        console.log(`⚠️ ${config.role} already exists (${email}) — skipping`);
        continue;
      }

      const hashedPassword = await hashPassword(password);
      await User.create({
        full_name: fullName,
        email,
        phone_number: '0000000000',
        password: hashedPassword,
        role: config.role,
        is_active: true
      });

      console.log(`✅ ${fullName} created successfully!`);
      console.log('   📧 Email:', email);
      console.log('   🔑 Password:', password);
    }

    console.log('⚠️  Please change these default passwords after first login!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding role users:', error.message);
    process.exit(1);
  }
};

seedRoleUsers();
