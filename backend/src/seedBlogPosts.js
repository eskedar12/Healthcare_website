import { sequelize, Post } from './models/index.js'

// One-off seed script — imports the sample articles that used to live only
// in the frontend's static src/data/blogPosts.js file into the real `posts`
// table, now that the Blog admin page and public Blog page read from the
// database. Safe to run more than once: posts whose slug already exists
// are skipped rather than duplicated.
//
// Run with: node src/seedBlogPosts.js
const SAMPLE_POSTS = [
  {
    slug: 'understanding-anxiety',
    title: 'Understanding anxiety: signs, causes, and when to seek help',
    category: 'Mental Health',
    author: 'Lebeza Clinical Team',
    excerpt:
      'Anxiety is one of the most common mental health concerns we see at Lebeza. Here is how to recognize it early and what treatment can look like.',
    image: null,
    published_at: new Date('2026-06-02'),
    content: [
      'Anxiety is one of the most common mental health concerns we see at Lebeza. In small doses it is a normal, even useful, response to stress — but for many people it becomes persistent, overwhelming, and disruptive to daily life.',
      'Common signs include ongoing worry that is hard to control, restlessness, difficulty concentrating, muscle tension, trouble sleeping, and physical symptoms like a racing heart or shortness of breath. These symptoms can show up gradually or arrive suddenly during a panic episode.',
      'Anxiety disorders often develop from a mix of genetics, life experiences, and ongoing stress. There is rarely a single cause, and it is not a sign of weakness or a character flaw — it is a medical condition that responds well to treatment.',
      'If worry is interfering with your work, relationships, or daily routine for more than a few weeks, it is worth speaking to a professional. At Lebeza, treatment typically combines a thorough evaluation, psychotherapy such as CBT, and, where appropriate, medication management, all tailored to what each patient needs.',
      'Early support tends to lead to better outcomes, so please do not wait until things feel unmanageable. Our team is here to help you build a plan that works for your life.',
    ],
  },
  {
    slug: 'supporting-a-teen',
    title: 'Supporting a teenager through emotional change',
    category: 'Child & Adolescent',
    author: 'Child & Adolescent Department',
    excerpt:
      'Adolescence brings big emotional shifts. Our child and adolescent team shares practical ways parents can support teens at home.',
    image: null,
    published_at: new Date('2026-05-18'),
    content: [
      'Adolescence brings some of the biggest emotional and social changes a person will experience. Mood swings, a stronger need for independence, and shifting friendships are all a normal part of development, but they can be hard to navigate as a parent.',
      'Start by keeping communication open without judgment. Teens are more likely to share what is really going on when they feel listened to rather than immediately corrected or lectured.',
      'Watch for changes that go beyond typical moodiness: withdrawing from friends and activities they used to enjoy, big changes in sleep or appetite, declining grades, or talk of hopelessness. These can be signs it is time to bring in professional support.',
      'Involve your teen in decisions about their own care where possible — a sense of control matters a great deal at this age. Our child and adolescent team works with both the young person and the family, so support at home and in the clinic reinforce each other.',
      'Above all, remind your teen that needing support is not a failure. Reaching out early, for both parents and teens, tends to make a real difference.',
    ],
  },
  {
    slug: 'therapy-myths',
    title: '5 common myths about psychotherapy, debunked',
    category: 'Psychotherapy',
    author: 'Lebeza Clinical Team',
    excerpt:
      'Think therapy is only for crisis moments? We break down the misconceptions that keep people from getting support sooner.',
    image: null,
    published_at: new Date('2026-04-27'),
    content: [
      '"Therapy is only for people in crisis." In reality, many people come to therapy simply to build better coping skills, work through a life transition, or understand themselves more clearly, not only during a crisis.',
      '"Talking to a therapist is the same as talking to a friend." A trained therapist brings clinical training, an outside perspective, and structured techniques that are different from, and complementary to, support from friends and family.',
      '"Going to therapy means something is wrong with you." Seeking support is a proactive step toward wellbeing, in the same way seeing a doctor for a check-up is proactive, not a sign of failure.',
      '"Therapy takes years to work." Many people notice meaningful progress within a few months, and the right length of treatment depends entirely on individual goals, some short-term, some longer-term.',
      '"If medication is recommended, therapy has failed." Medication and therapy often work well together, and a good treatment plan uses whichever combination best supports each individual patient.',
    ],
  },
  {
    slug: 'building-daily-resilience',
    title: 'Building daily resilience: small habits, real impact',
    category: 'Wellness',
    author: 'Lebeza Clinical Team',
    excerpt:
      'Simple, evidence-based routines our clinicians recommend for maintaining mental wellbeing between appointments.',
    image: null,
    published_at: new Date('2026-03-11'),
    content: [
      'Resilience is not a fixed trait, it is a set of habits and skills that can be built over time, the same way physical fitness is built through consistent practice.',
      'A consistent sleep schedule is one of the most powerful, and most overlooked, foundations for emotional stability. Poor sleep can amplify anxiety, irritability, and low mood.',
      'Regular movement, even a short daily walk, has a measurable positive effect on mood by supporting healthy brain chemistry and giving the mind a break from rumination.',
      'Staying connected matters too — regular contact with people you trust, even briefly, helps buffer the effects of stress. Isolation tends to make difficult emotions feel bigger than they are.',
      'Finally, notice small wins. Keeping a short daily note of one thing that went well, however minor, gradually trains attention toward what is working rather than only what is hard. These habits will not replace professional care when it is needed, but they are a strong foundation to build on between appointments.',
    ],
  },
]

async function seedBlogPosts() {
  try {
    for (const postData of SAMPLE_POSTS) {
      const existing = await Post.findOne({ where: { slug: postData.slug } })
      if (existing) {
        console.log(`Skipping "${postData.title}" — slug already exists.`)
        continue
      }
      await Post.create({ ...postData, is_published: true })
      console.log(`Inserted "${postData.title}"`)
    }
    console.log('Done seeding blog posts.')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await sequelize.close()
  }
}

seedBlogPosts()
