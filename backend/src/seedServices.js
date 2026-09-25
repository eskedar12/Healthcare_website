import { sequelize, Service } from './models/index.js'

// One-off seed script — imports the 6 main page services into the real
// `services` table so they appear in the admin Services page.
// Safe to run more than once: services whose code already exists are skipped.
const SERVICES_TO_SEED = [
  {
    code: 'SRV-001',
    name: 'Psychiatric Consultation',
    duration: '45-60 mins',
    price: 'Contact Clinic',
    status: 'Active'
  },
  {
    code: 'SRV-002',
    name: 'Clinical Psychology',
    duration: '45-60 mins',
    price: 'Contact Clinic',
    status: 'Active'
  },
  {
    code: 'SRV-003',
    name: 'Psychotherapy',
    duration: '50 mins',
    price: 'Contact Clinic',
    status: 'Active'
  },
  {
    code: 'SRV-004',
    name: 'Child & Adolescent Care',
    duration: '45-60 mins',
    price: 'Contact Clinic',
    status: 'Active'
  },
  {
    code: 'SRV-005',
    name: 'Community Mental Health',
    duration: 'Variable',
    price: 'Free / Outreach',
    status: 'Active'
  },
  {
    code: 'SRV-006',
    name: 'Crisis Intervention',
    duration: 'Immediate',
    price: 'Contact Clinic',
    status: 'Active'
  }
]

async function seedServices() {
  try {
    for (const service of SERVICES_TO_SEED) {
      const existing = await Service.findOne({ where: { code: service.code } })
      if (existing) {
        console.log(`Skipping "${service.name}" (${service.code}) — already exists.`)
        continue
      }
      await Service.create(service)
      console.log(`✅ Inserted service "${service.name}" (${service.code})`)
    }

    console.log('🎉 Service seeding complete.')
  } catch (error) {
    console.error('❌ Failed to seed services:', error)
  } finally {
    await sequelize.close()
  }
}

seedServices()
