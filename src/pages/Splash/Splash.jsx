import { useNavigate } from 'react-router-dom'
import styles from './Splash.module.css'

const stats = [
  { number: '10k+', label: 'Active Writers' },
  { number: '25k+', label: 'Stories Created' },
  { number: '500k+', label: 'Story Snippets' },
]

const features = [
  {
    short: 'Co',
    title: 'Collaborative Writing',
    desc: 'Write scenes together, swap live feedback, and co-create new worlds with writers from around the world.',
    tint: 'linear-gradient(135deg, #f3e9ff, #e3deff)',
  },
  {
    short: 'So',
    title: 'Social Community',
    desc: 'Follow your favorite storytellers, track discussion threads, and discover new voices making collaborative stories.',
    tint: 'linear-gradient(135deg, #e8f2ff, #dde7ff)',
  },
  {
    short: 'Live',
    title: 'Real-Time Chat',
    desc: 'Communicate with co-authors in real time and plan your story’s direction together.',
    tint: 'linear-gradient(135deg, #e8fff6, #d8f4ed)',
  },
  {
    short: 'Find',
    title: 'Story Discovery',
    desc: 'Explore stories by genre, popularity, or the next collaborative opportunity.',
    tint: 'linear-gradient(135deg, #fff5e6, #ffe9d2)',
  },
  {
    short: 'Save',
    title: 'Read Later',
    desc: 'Save interesting stories and chapters to read when you have time.',
    tint: 'linear-gradient(135deg, #f5f3ff, #edf0ff)',
  },
  {
    short: 'Rate',
    title: 'Rate & Review',
    desc: 'Rate stories, comment on segments, and provide feedback to fellow writers.',
    tint: 'linear-gradient(135deg, #fff0f3, #ffe3eb)',
  },
]

const steps = [
  {
    title: 'Create or Join',
    desc: 'Start a new story or join an existing collaboration project that interests you.',
  },
  {
    title: 'Write Together',
    desc: 'Add your segments, collaborate in real-time, and keep amazing stories moving.',
  },
  {
    title: 'Share & Discover',
    desc: 'Publish your collaborative masterpieces and discover new stories from the community.',
  },
]

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Fantasy Writer',
    quote:
      'InKreate has revolutionized how I write. Collaborating with fellow writers makes my stories so much richer and more alive.',
    stars: 5,
  },
  {
    name: 'Mark D.',
    role: 'Sci-Fi Author',
    quote:
      'I adore being part of a writing community where everyone can contribute! The real-time collaboration features are a game changer.',
    stars: 5,
  },
  {
    name: 'Jessica R.',
    role: 'Romance Author',
    quote: 'My stories look so polished now—InKreate helped me find new partners for storytelling through collaboration.',
    stars: 5,
  },
]

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.starIcon} aria-hidden="true">
      <path d="M12 17.3 6.91 20l.98-5.63L3 9.86l5.65-.82L12 4l3.35 5.04 5.65.82-4.12 4.48.98 5.63z" />
    </svg>
  )
}

function Splash() {
  const navigate = useNavigate()

  const goToAuth = () => {
    navigate('/authentication')
  }

  const scrollToFeatures = () => {
    const target = document.getElementById('features')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroBackdrop} />
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <div className={styles.heroCard}>
            <div className={styles.brand}>
              <div className={styles.brandMark} aria-hidden="true">
                <span className={styles.foldLeft} />
                <span className={styles.foldRight} />
              </div>
              <div>
                <div className={styles.brandName}>InKreate</div>
                <div className={styles.brandTag}>Stories written together</div>
              </div>
            </div>

            <h1>
              Where stories come alive through{' '}
              <span className={styles.accent}>collaborative storytelling</span>
            </h1>
            <p className={styles.lead}>
              Join a vibrant community of writers who create incredible stories together. Write,
              collaborate, discover, and connect with storytellers from around the world.
            </p>
            <div className={styles.ctaRow}>
              <button className={styles.primaryCta} onClick={goToAuth}>
                Start Writing Together
              </button>
              <button className={styles.secondaryCta} onClick={scrollToFeatures}>
                Explore Features
              </button>
            </div>
            <div className={styles.statsRow}>
              {stats.map((stat) => (
                <div key={stat.label} className={styles.statCard}>
                  <div className={styles.statNumber}>{stat.number}</div>
                  <div className={styles.statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>Why Choose InKreate</p>
          <h2>Discover the tools and community features that make collaborative storytelling magical</h2>
        </div>
        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <div key={feature.title} className={styles.featureCard}>
              <div className={styles.featureIcon} style={{ background: feature.tint }}>
                <span>{feature.short}</span>
              </div>
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>How It Works</p>
          <h2>Start your collaborative writing journey in three simple steps</h2>
        </div>
        <div className={styles.steps}>
          {steps.map((step, index) => (
            <div key={step.title} className={styles.step}>
              <div className={styles.stepBadge}>
                <span>{index + 1}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>What Writers Say</p>
          <h2>Hear from our community of collaborative storytellers</h2>
        </div>
        <div className={styles.testimonials}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className={styles.testimonialCard}>
              <div className={styles.stars} aria-label={`${testimonial.stars}-star rating`}>
                {Array.from({ length: testimonial.stars }).map((_, index) => (
                  <StarIcon key={index} />
                ))}
              </div>
              <p className={styles.quote}>"{testimonial.quote}"</p>
              <div className={styles.person}>
                <div className={styles.personMeta}>
                  <div className={styles.personName}>{testimonial.name}</div>
                  <div className={styles.personRole}>{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.ctaBanner}>
        <div className={styles.ctaInner}>
          <div>
            <p className={styles.kicker}>Ready to Start Your Collaborative Writing Journey?</p>
            <h3>
              Join thousands of writers who are already creating incredible stories together on
              InKreate.
            </h3>
          </div>
          <div className={styles.ctaActions}>
            <button className={styles.primaryCta} onClick={goToAuth}>
              Join the Community
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Splash
