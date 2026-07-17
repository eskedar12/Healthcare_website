// Single source of truth for every doctor profile shown across the site
// (homepage teaser, /doctors listing, /doctors/:id detail page, and the
// About page team grid) — keeps names, photos and ids in sync so a card
// clicked anywhere links to the same, correct profile.

import doc1 from '../assets/doctors/doc1.png'
import doc2 from '../assets/doctors/doc2.png'
import doc3 from '../assets/doctors/doc3.png'
import doc4 from '../assets/doctors/doc4.jpg'
import doc5 from '../assets/doctors/doc5.jpg'
import doc6 from '../assets/doctors/doc6.jpg'
import doc7 from '../assets/doctors/doc7.jpg'
import doc8 from '../assets/doctors/doc8.jpg'
import doc9 from '../assets/doctors/doc9.jpg'
import doc10 from '../assets/doctors/doc10.jpg'

const DOCTORS = [
  {
    id: 1,
    name: 'Dr. Alemtsehay Iyassu',
    role: 'Vice CO, Psychiatrist',
    specialty: 'Vice CO, Psychiatrist',
    image: doc1,
    bio: 'Dr. Iyassu supports Lebeza\'s clinical leadership and oversight, helping guide the clinic\'s standard of care across all departments.',
    education: ['MD, Addis Ababa University'],
    languages: ['Amharic', 'English'],
    departments: ['Leadership', 'Adult Psychiatry'],
    isLeadership: true,
  },
  {
    id: 2,
    name: 'Dr. Elizabeth Berhanu',
    role: 'Medical Director, Psychiatrist',
    specialty: 'Medical Director, Psychiatrist',
    image: doc2,
    bio: 'As Medical Director, Dr. Berhanu oversees clinical quality and treatment standards across Lebeza\'s psychiatry and psychotherapy services.',
    education: ['MD, Addis Ababa University', 'Psychiatry Residency'],
    languages: ['Amharic', 'English'],
    departments: ['Leadership', 'Adult Psychiatry'],
    isLeadership: true,
  },
  {
    id: 3,
    name: 'Dr. Amir Bekele',
    role: 'Consultant Psychiatrist',
    specialty: 'Consultant Psychiatrist',
    image: doc3,
    bio: 'Dr. Bekele co-founded Lebeza in 2016 and has over 15 years of experience treating mood and anxiety disorders in adults.',
    education: ['MD, Addis Ababa University', 'Psychiatry Residency, Black Lion Hospital'],
    languages: ['Amharic', 'English'],
    departments: ['Adult Psychiatry', 'Crisis & Emergency'],
  },
  {
    id: 4,
    name: 'Dr. Sara Tadesse',
    role: 'Clinical Psychologist',
    specialty: 'Clinical Psychologist',
    image: doc4,
    bio: 'Dr. Tadesse specializes in cognitive behavioral therapy and works closely with patients navigating trauma and grief.',
    education: ['MSc Clinical Psychology, Addis Ababa University'],
    languages: ['Amharic', 'English'],
    departments: ['Clinical Psychology', 'Psychotherapy'],
  },
  {
    id: 5,
    name: 'Dr. Yonas Girma',
    role: 'Child Psychiatrist',
    specialty: 'Child Psychiatrist',
    image: doc5,
    bio: 'Dr. Girma leads our child and adolescent department, working with families on developmental and behavioral concerns.',
    education: ['MD, Jimma University', 'Fellowship in Child Psychiatry'],
    languages: ['Amharic', 'English', 'Afaan Oromo'],
    departments: ['Child & Adolescent'],
  },
  {
    id: 6,
    name: 'Dr. Hana Mulatu',
    role: 'Psychotherapist',
    specialty: 'Psychotherapist',
    image: doc6,
    bio: 'Dr. Mulatu offers individual and group psychotherapy grounded in trauma-informed, evidence-based practice.',
    education: ['MA Counseling Psychology'],
    languages: ['Amharic', 'English'],
    departments: ['Psychotherapy'],
  },
  {
    id: 7,
    name: 'Dr. Elias Worku',
    role: 'Consultant Psychiatrist',
    specialty: 'Consultant Psychiatrist',
    image: doc7,
    bio: 'Dr. Worku brings over a decade of experience in adult psychiatry, with a focus on mood disorders and long-term care planning.',
    education: ['MD, Gondar University', 'Psychiatry Residency'],
    languages: ['Amharic', 'English'],
    departments: ['Adult Psychiatry'],
  },
  {
    id: 8,
    name: 'Dr. Bethlehem Assefa',
    role: 'Clinical Psychologist',
    specialty: 'Clinical Psychologist',
    image: doc8,
    bio: 'Dr. Assefa works with individuals and couples using evidence-based approaches to anxiety, relationship, and life-transition concerns.',
    education: ['MSc Clinical Psychology'],
    languages: ['Amharic', 'English'],
    departments: ['Clinical Psychology'],
  },
  {
    id: 9,
    name: 'Dr. Dawit Alemu',
    role: 'Psychiatric Nurse Specialist',
    specialty: 'Psychiatric Nurse Specialist',
    image: doc9,
    bio: 'Dawit provides day-to-day psychiatric nursing care, medication administration, and patient support across the clinic\'s inpatient and outpatient services.',
    education: ['BSc Psychiatric Nursing'],
    languages: ['Amharic', 'English'],
    departments: ['Adult Psychiatry'],
  },
  {
    id: 10,
    name: 'Dr. Ruth Kebede',
    role: 'Child & Adolescent Psychiatrist',
    specialty: 'Child & Adolescent Psychiatrist',
    image: doc10,
    bio: 'Dr. Kebede works alongside families and schools to support children and teenagers through developmental, behavioral and emotional challenges.',
    education: ['MD, Addis Ababa University', 'Fellowship in Child & Adolescent Psychiatry'],
    languages: ['Amharic', 'English'],
    departments: ['Child & Adolescent'],
  },
]

// Doctors shown on the homepage teaser (clinical staff only, first 5)
export const FEATURED_DOCTORS = DOCTORS.filter((d) => !d.isLeadership).slice(0, 6)

// All clinical staff shown on the /doctors listing page
export const CLINICAL_DOCTORS = DOCTORS.filter((d) => !d.isLeadership)

// Everyone shown on the About page's "Meet our team" grid
export const TEAM_MEMBERS = DOCTORS

export const getDoctorById = (id) => DOCTORS.find((d) => String(d.id) === String(id))

export default DOCTORS