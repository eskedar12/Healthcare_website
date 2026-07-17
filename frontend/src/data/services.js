import imgConsultation from '../assets/services/psychiatric-consultation.svg'
import imgPsychology from '../assets/services/clinical-psychology.svg'
import imgPsychotherapy from '../assets/services/psychotherapy.svg'
import imgChild from '../assets/services/child-adolescent-care.svg'
import imgCommunity from '../assets/services/community-mental-health.svg'
import imgCrisis from '../assets/services/crisis-intervention.svg'

// Single source of truth for every service shown across the site
// (homepage teaser, /services listing, and /services/:slug detail page).
const SERVICES = [
  {
    id: 1,
    slug: 'psychiatric-consultation',
    name: 'Psychiatric Consultation',
    icon: '🧠',
    image: imgConsultation,
    description: 'Comprehensive evaluation and diagnosis by experienced psychiatrists.',
    longDescription:
      "Our psychiatrists conduct thorough clinical assessments to understand each patient's history, symptoms, and goals — leading to a personalized treatment plan combining therapy, medication management, and ongoing support where appropriate.",
    highlights: ['Full diagnostic evaluation', 'Personalized treatment plans', 'Medication management', 'Ongoing follow-up'],
  },
  {
    id: 2,
    slug: 'clinical-psychology',
    name: 'Clinical Psychology',
    icon: '💬',
    image: imgPsychology,
    description: 'Psychological assessment and evidence-based therapeutic interventions.',
    longDescription:
      'Licensed clinical psychologists work with individuals and families using standardized assessments and structured therapeutic approaches to address a wide range of emotional and behavioral concerns.',
    highlights: ['Psychological testing', 'CBT & DBT approaches', 'Family sessions', 'Confidential setting'],
  },
  {
    id: 3,
    slug: 'psychotherapy',
    name: 'Psychotherapy',
    icon: '🌿',
    image: imgPsychotherapy,
    description: 'Individual and group therapy using proven therapeutic approaches.',
    longDescription:
      "We offer individual and group psychotherapy sessions led by trained therapists, tailored to each patient's pace and comfort — grounded in evidence-based modalities.",
    highlights: ['Individual sessions', 'Group therapy', 'Trauma-informed care', 'Flexible scheduling'],
  },
  {
    id: 4,
    slug: 'child-adolescent-care',
    name: 'Child & Adolescent Care',
    icon: '🌱',
    image: imgChild,
    description: 'Specialized mental health support tailored for young patients.',
    longDescription:
      'Our child and adolescent psychiatry team provides age-appropriate assessment and care, working closely with families and schools to support healthy development.',
    highlights: ['Developmental assessment', 'Family involvement', 'School coordination', 'Play & talk therapy'],
  },
  {
    id: 5,
    slug: 'community-mental-health',
    name: 'Community Mental Health',
    icon: '🤝',
    image: imgCommunity,
    description: 'Outreach programs and community-level mental health promotion.',
    longDescription:
      'Through outreach and education programs, we bring mental health awareness and early intervention services directly to underserved communities across Addis Ababa.',
    highlights: ['Community workshops', 'Awareness campaigns', 'Early screening', 'Referral pathways'],
  },
  {
    id: 6,
    slug: 'crisis-intervention',
    name: 'Crisis Intervention',
    icon: '⚡',
    image: imgCrisis,
    description: 'Immediate professional support for acute mental health crises.',
    longDescription:
      'Our team is available around the clock to provide urgent psychiatric support, stabilization, and safe follow-up planning during acute mental health crises.',
    highlights: ['24/7 availability', 'Rapid assessment', 'Safety planning', 'Ambulance support'],
  },
]

export const getServiceBySlug = (slug) => SERVICES.find((s) => s.slug === slug)

export default SERVICES
