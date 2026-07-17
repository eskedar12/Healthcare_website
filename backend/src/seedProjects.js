import { sequelize, Project } from './models/index.js'

// One-off seed script — imports the sample project list that used to be
// hardcoded in the frontend's ProjectsPage.jsx into the real `projects`
// table, now that the Projects admin page and public Projects page read
// from the database. Safe to run more than once: projects whose name
// already exists are skipped rather than duplicated.
//
// is_featured is set on the three items that used to render in bold on the
// public Projects page, so the page looks the same as before once the data
// comes from the database. Adjust freely from the admin Projects page.
//
// Run with: node src/seedProjects.js
const SAMPLE_PROJECTS = [
  { name: 'MHPSS trainings', is_featured: true },
  { name: 'Project implementation, monitoring and evaluation', is_featured: false },
  { name: 'Mental health need assessment', is_featured: false },
  { name: 'MHPSS staff supervision and mentoring', is_featured: true },
  { name: 'Mental health related researches', is_featured: false },
  { name: 'MHPSS document preparation', is_featured: false },
  { name: 'Individual and group counselling services for staff and beneficiaries', is_featured: true },
]

async function seedProjects() {
  try {
    for (let i = 0; i < SAMPLE_PROJECTS.length; i++) {
      const { name, is_featured } = SAMPLE_PROJECTS[i]
      const existing = await Project.findOne({ where: { name } })
      if (existing) {
        console.log(`Skipping "${name}" — already exists.`)
        continue
      }
      await Project.create({
        name,
        is_featured,
        is_active: true,
        sort_order: i,
      })
      console.log(`Inserted "${name}"`)
    }
    console.log('Done seeding projects.')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await sequelize.close()
  }
}

seedProjects()
