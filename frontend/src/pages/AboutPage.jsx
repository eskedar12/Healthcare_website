import { Link } from 'react-router-dom'
import SectionLabel from '../components/ui/SectionLabel'
import StatCard from '../components/ui/StatCard'
import Button from '../components/ui/Button'
import TrustedBySection from '../components/home/TrustedBySection'
import useFetch from '../hooks/useFetch'
import { useEditableSection } from '../hooks/useEditableSection'
import EditableText from '../components/editable/EditableText'
import EditableImage from '../components/editable/EditableImage'
import aboutImage from '../assets/images/about.png'
import { TEAM_MEMBERS } from '../data/doctors'

const STATS = [
  { icon: '◷', value: '24/7', label: 'Working Hours' },
  { icon: '♡', value: '2,426+', label: 'Patients a Year' },
  { icon: '⚕', value: '35', label: 'Clinical Staff' },
  { icon: '✦', value: '40+', label: 'Community Projects' },
]

const DEFAULT_HEADER = {
  title: 'About Lebeza',
  subtitle: 'Meet our CEO',
  bio1:
    "Dr. Asmeret Andebirhan Birhan is a Psychiatrist who began her practice as a clinician and healthcare leader in 2010. She has been active in Clinical care, Mental Health, Innovation and Leadership in both public and private set ups. She has led new mental health interventions with significant impact to the community notably the establishment of the first and to-date the only substance rehabilitation center in the country.",
  bio2:
    "In 2015, she established her own company, Lebeza Psychiatry Consultation PLC, which provides Mental Health Consultation services and runs a Psychiatry Clinic. A vibrant and passionate clinician, Dr. Birhan has exceptional communication skills that has enabled her to be the psychiatrist of choice for domestic mega corporations and international organizations such as IOM and the US Embassy. Dr. Birhan is the current a member of the Italian Neuropsychiatry Association and a board member of the Ethiopian Travelers' Health Screening Providers Association.",
}

const DEFAULT_MISSION = {
  weExist:
    "To restore our clients' wellness by providing client-centered, holistic, and high-quality mental health services that leverage innovation, competency, and standard of care practices.",
  ourValues: [
    'Professionalism: We provide psychiatry care through highly compassionate, experienced and competent professionals.',
    'Client-Centered: We always put our patients at the center of our endeavor for excellence.',
    "Confidentiality: We equally value our patients' information and make sure that it remains strictly confidential.",
  ],
  weAim:
    'To see Lebeza providing holistic mental health services as part of its quest to become the go-to center in the global mental health industry.',
}

const DEFAULT_TEAM = {
  title: 'Meet our team members',
  subtitle: 'The team consists of a variety of professionals, such as event managers, youth counselors, and volunteers.',
}

const DEFAULT_CTA = {
  title: 'Ready to take the first step toward peace of mind?',
}

// Merge a fetched object over defaults, but only take fetched values that are
// non-empty strings/arrays. This stops the API returning "" or [] (instead of
// simply omitting the key) from silently blanking out the fallback copy.
const mergeDefined = (defaults, incoming) => {
  if (!incoming) return { ...defaults }
  const result = { ...defaults }
  for (const key of Object.keys(defaults)) {
    const val = incoming[key]
    const isEmptyString = typeof val === 'string' && val.trim() === ''
    const isEmptyArray = Array.isArray(val) && val.length === 0
    if (val !== undefined && val !== null && !isEmptyString && !isEmptyArray) {
      result[key] = val
    }
  }
  return result
}

const AboutPage = () => {
  const { data } = useFetch('/content/about')

  const fetchedHeader = mergeDefined(DEFAULT_HEADER, data?.data?.header)
  const headerInitial = { ...fetchedHeader, image: data?.data?.header?.image || null }
  const { value: header, updateField: updateHeaderField } = useEditableSection(
    'about',
    'header',
    headerInitial
  )

  const missionInitial = {
    ...mergeDefined(DEFAULT_MISSION, data?.data?.mission),
    ourValues:
      data?.data?.mission?.ourValues?.length === 3
        ? data.data.mission.ourValues
        : DEFAULT_MISSION.ourValues,
  }
  const { value: mission, updateField: updateMissionField, updateAll: updateMissionAll } =
    useEditableSection('about', 'mission', missionInitial)

  const teamInitial = mergeDefined(DEFAULT_TEAM, data?.data?.team)
  const { value: team, updateField: updateTeamField } = useEditableSection('about', 'team', teamInitial)

  const ctaInitial = mergeDefined(DEFAULT_CTA, data?.data?.cta)
  const { value: cta, updateField: updateCtaField } = useEditableSection('about', 'cta', ctaInitial)

  const updateValueAt = (index, text) => {
    const next = [...mission.ourValues]
    next[index] = text
    updateMissionAll({ ...mission, ourValues: next })
  }

  return (
    <div>
      {/* Header */}
      <section className="bg-cream-dark py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left side - Content */}
            <div>
              <EditableText
                as="h1"
                value={header.title}
                onChange={(v) => updateHeaderField('title', v)}
                className="font-serif text-text-dark leading-tight max-w-2xl mb-6 text-balance"
                style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
              />

              <EditableText
                as="h2"
                value={header.subtitle}
                onChange={(v) => updateHeaderField('subtitle', v)}
                className="font-serif text-text-dark leading-tight max-w-2xl mb-4 text-balance"
                style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}
              />

              <EditableText
                as="p"
                value={header.bio1}
                onChange={(v) => updateHeaderField('bio1', v)}
                multiline
                className="font-sans text-text-body text-base leading-relaxed max-w-3xl"
              />
              <EditableText
                as="p"
                value={header.bio2}
                onChange={(v) => updateHeaderField('bio2', v)}
                multiline
                className="font-sans text-text-body text-base leading-relaxed max-w-3xl mt-4"
              />
            </div>

            {/* Right side - Image (smaller) */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-xs lg:max-w-sm rounded-2xl shadow-lg overflow-hidden">
                <EditableImage
                  value={header.image}
                  onChange={(v) => updateHeaderField('image', v)}
                  fallbackSrc={aboutImage}
                  alt="About Lebeza"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-forest py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
            {STATS.map((stat) => (
              <StatCard key={stat.label} {...stat} light />
            ))}
          </div>
        </div>
      </section>

      {/* Mission, Values, Vision */}
      <section className="bg-cream py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* We exist - Mission */}
            <div className="flex flex-col">
              <h2
                className="font-serif text-text-dark leading-tight mb-4"
                style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)' }}
              >
                We exist
              </h2>
              <EditableText
                as="p"
                value={mission.weExist}
                onChange={(v) => updateMissionField('weExist', v)}
                multiline
                className="font-sans text-text-body text-base leading-relaxed flex-1"
              />
            </div>

            {/* Our values - Middle column takes more space */}
            <div className="flex flex-col lg:col-span-1">
              <h2
                className="font-serif text-text-dark leading-tight mb-4"
                style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)' }}
              >
                Our values
              </h2>
              <div className="space-y-4 flex-1">
                {mission.ourValues.map((value, i) => (
                  <div key={i}>
                    <EditableText
                      as="p"
                      value={value}
                      onChange={(v) => updateValueAt(i, v)}
                      multiline
                      className="font-sans text-text-body text-sm leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* We aim - Vision */}
            <div className="flex flex-col">
              <h2
                className="font-serif text-text-dark leading-tight mb-4"
                style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)' }}
              >
                We aim
              </h2>
              <EditableText
                as="p"
                value={mission.weAim}
                onChange={(v) => updateMissionField('weAim', v)}
                multiline
                className="font-sans text-text-body text-base leading-relaxed flex-1"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="bg-cream-dark py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <EditableText
              as="h2"
              value={team.title}
              onChange={(v) => updateTeamField('title', v)}
              className="font-serif text-text-dark leading-tight"
              style={{ fontSize: 'clamp(2rem, 3vw, 2.75rem)' }}
            />
            <EditableText
              as="p"
              value={team.subtitle}
              onChange={(v) => updateTeamField('subtitle', v)}
              multiline
              className="font-sans text-text-body text-base leading-relaxed max-w-2xl mx-auto mt-4"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {TEAM_MEMBERS.map((member) => (
              <Link
                to={`/doctors/${member.id}`}
                key={member.id}
                className="group bg-cream rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow block"
              >
                <div className="aspect-square bg-cream-darker flex items-center justify-center overflow-hidden">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-forest/10 to-forest/5 flex items-center justify-center">
                      <span className="text-6xl opacity-20">👤</span>
                    </div>
                  )}
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-serif text-lg text-text-dark font-semibold group-hover:text-forest transition-colors">
                    {member.name}
                  </h3>
                  <p className="font-sans text-sm text-text-body">{member.role}</p>
                  <span className="inline-block mt-2 text-xs font-sans text-forest opacity-0 group-hover:opacity-100 transition-opacity">
                    View profile →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream-dark py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <EditableText
            as="h2"
            value={cta.title}
            onChange={(v) => updateCtaField('title', v)}
            multiline
            className="font-serif text-text-dark leading-tight max-w-lg text-balance"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
          />
          <div className="flex gap-4 flex-shrink-0">
            <Link to="/book">
              <Button variant="primary" size="lg">Book Here</Button>
            </Link>
            <Link to="/doctors">
              <Button variant="outline" size="lg">Meet our doctors</Button>
            </Link>
          </div>
        </div>
      </section>

      <TrustedBySection />
    </div>
  )
}

export default AboutPage