import { sequelize, Doctor } from './models/index.js'

// One-off seed script — imports the doctor profiles that used to be
// hardcoded in the frontend's src/data/doctors.js into the real `doctors`
// table, so they show up in the admin Doctors page (and the public site can
// eventually be switched to fetch them from the API instead of the
// hardcoded file). Safe to run more than once: doctors whose email already
// exists are skipped rather than duplicated.
//
// email/phone are placeholders (the model requires both, but the frontend
// data never had them) — update each doctor with real contact info from
// the admin Doctors page. image is left blank for the same reason — the
// bundled photo imports aren't real URLs outside the frontend build; upload
// each photo once through the admin Doctors edit page.
//
// Run with: node src/seedDoctors.js
const SAMPLE_DOCTORS = [
  {
    name: 'Dr. Alemtsehay Iyassu',
    title: 'Vice CO, Psychiatrist',
    specialty: 'Vice CO, Psychiatrist',
    department: 'Leadership',
    email: 'alemtsehay.iyassu@lebeza-clinic.com',
    phone: '+251 900 000 001',
    bio: "Dr. Iyassu supports Lebeza's clinical leadership and oversight, helping guide the clinic's standard of care across all departments.",
    education: 'MD, Addis Ababa University',
    languages: 'Amharic, English',
  },
  {
    name: 'Dr. Elizabeth Berhanu',
    title: 'Medical Director, Psychiatrist',
    specialty: 'Medical Director, Psychiatrist',
    department: 'Leadership',
    email: 'elizabeth.berhanu@lebeza-clinic.com',
    phone: '+251 900 000 002',
    bio: "As Medical Director, Dr. Berhanu oversees clinical quality and treatment standards across Lebeza's psychiatry and psychotherapy services.",
    education: 'MD, Addis Ababa University; Psychiatry Residency',
    languages: 'Amharic, English',
  },
  {
    name: 'Dr. Amir Bekele',
    title: 'Consultant Psychiatrist',
    specialty: 'Consultant Psychiatrist',
    department: 'Adult Psychiatry',
    email: 'amir.bekele@lebeza-clinic.com',
    phone: '+251 900 000 003',
    bio: 'Dr. Bekele co-founded Lebeza in 2016 and has over 15 years of experience treating mood and anxiety disorders in adults.',
    education: 'MD, Addis Ababa University; Psychiatry Residency, Black Lion Hospital',
    languages: 'Amharic, English',
  },
  {
    name: 'Dr. Sara Tadesse',
    title: 'Clinical Psychologist',
    specialty: 'Clinical Psychologist',
    department: 'Clinical Psychology',
    email: 'sara.tadesse@lebeza-clinic.com',
    phone: '+251 900 000 004',
    bio: 'Dr. Tadesse specializes in cognitive behavioral therapy and works closely with patients navigating trauma and grief.',
    education: 'MSc Clinical Psychology, Addis Ababa University',
    languages: 'Amharic, English',
  },
  {
    name: 'Dr. Yonas Girma',
    title: 'Child Psychiatrist',
    specialty: 'Child Psychiatrist',
    department: 'Child & Adolescent',
    email: 'yonas.girma@lebeza-clinic.com',
    phone: '+251 900 000 005',
    bio: 'Dr. Girma leads our child and adolescent department, working with families on developmental and behavioral concerns.',
    education: 'MD, Jimma University; Fellowship in Child Psychiatry',
    languages: 'Amharic, English, Afaan Oromo',
  },
  {
    name: 'Dr. Hana Mulatu',
    title: 'Psychotherapist',
    specialty: 'Psychotherapist',
    department: 'Psychotherapy',
    email: 'hana.mulatu@lebeza-clinic.com',
    phone: '+251 900 000 006',
    bio: 'Dr. Mulatu offers individual and group psychotherapy grounded in trauma-informed, evidence-based practice.',
    education: 'MA Counseling Psychology',
    languages: 'Amharic, English',
  },
  {
    name: 'Dr. Elias Worku',
    title: 'Consultant Psychiatrist',
    specialty: 'Consultant Psychiatrist',
    department: 'Adult Psychiatry',
    email: 'elias.worku@lebeza-clinic.com',
    phone: '+251 900 000 007',
    bio: 'Dr. Worku brings over a decade of experience in adult psychiatry, with a focus on mood disorders and long-term care planning.',
    education: 'MD, Gondar University; Psychiatry Residency',
    languages: 'Amharic, English',
  },
  {
    name: 'Dr. Bethlehem Assefa',
    title: 'Clinical Psychologist',
    specialty: 'Clinical Psychologist',
    department: 'Clinical Psychology',
    email: 'bethlehem.assefa@lebeza-clinic.com',
    phone: '+251 900 000 008',
    bio: 'Dr. Assefa works with individuals and couples using evidence-based approaches to anxiety, relationship, and life-transition concerns.',
    education: 'MSc Clinical Psychology',
    languages: 'Amharic, English',
  },
  {
    name: 'Dr. Dawit Alemu',
    title: 'Psychiatric Nurse Specialist',
    specialty: 'Psychiatric Nurse Specialist',
    department: 'Adult Psychiatry',
    email: 'dawit.alemu@lebeza-clinic.com',
    phone: '+251 900 000 009',
    bio: "Dawit provides day-to-day psychiatric nursing care, medication administration, and patient support across the clinic's inpatient and outpatient services.",
    education: 'BSc Psychiatric Nursing',
    languages: 'Amharic, English',
  },
  {
    name: 'Dr. Ruth Kebede',
    title: 'Child & Adolescent Psychiatrist',
    specialty: 'Child & Adolescent Psychiatrist',
    department: 'Child & Adolescent',
    email: 'ruth.kebede@lebeza-clinic.com',
    phone: '+251 900 000 010',
    bio: 'Dr. Kebede works alongside families and schools to support children and teenagers through developmental, behavioral and emotional challenges.',
    education: 'MD, Addis Ababa University; Fellowship in Child & Adolescent Psychiatry',
    languages: 'Amharic, English',
  },
]

async function seedDoctors() {
  try {
    for (const doctor of SAMPLE_DOCTORS) {
      const existing = await Doctor.findOne({ where: { email: doctor.email } })
      if (existing) {
        console.log(`Skipping "${doctor.name}" — already exists.`)
        continue
      }
      await Doctor.create({
        ...doctor,
        branches: [],
        is_active: true,
      })
      console.log(`Inserted "${doctor.name}"`)
    }

    console.log('🎉 Doctor seeding complete.')
    console.log('⚠️  Placeholder emails/phones were used — update real contact info from the admin Doctors page.')
    console.log('⚠️  Photos were not carried over — upload each one from the admin Doctors edit page.')
  } catch (error) {
    console.error('❌ Failed to seed doctors:', error)
  } finally {
    await sequelize.close()
  }
}

seedDoctors()