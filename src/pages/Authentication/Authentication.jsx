
import styles from './Authentication.module.css'
import AuthBox from '../../components/AuthBox/AuthBox.jsx'

const featurePoints = [
  { title: 'Collaborate', desc: 'Write stories together with others.', icon: 'pen' },
  { title: 'Connect', desc: 'Follow writers and make friends.', icon: 'people' },
  { title: 'Discover', desc: 'Explore amazing collaborative stories.', icon: 'book' },
]

function InkLogo() {
  return (
    <svg className={styles.logoMark} viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M26.6 7.9 12 22.4c-1.1 1.1-1.1 2.9 0 4l9.6 9.6c1.1 1.1 2.9 1.1 4 0L40.1 21c1.5-1.5 1.5-4 0-5.5l-6.2-6.2c-1.5-1.5-4-1.5-5.5 0Z"
        fill="none"
        stroke="url(#inkGradient)"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <circle cx="31.5" cy="16" r="2.5" fill="url(#inkGradient)" />
      <defs>
        <linearGradient id="inkGradient" x1="12" y1="24" x2="40" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a352ff" />
          <stop offset="1" stopColor="#5c56f6" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function FeatureIcon({ type }) {
  if (type === 'pen') {
    return (
      <svg viewBox="0 0 24 24" className={styles.featureIcon} aria-hidden="true">
        <path
          d="M14.3 4.3 19.7 9.7 9 20H4v-5z"
          stroke="url(#penGrad)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="penGrad" x1="4" y1="12" x2="20" y2="8" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a352ff" />
            <stop offset="1" stopColor="#5c56f6" />
          </linearGradient>
        </defs>
      </svg>
    )
  }
  if (type === 'people') {
    return (
      <svg viewBox="0 0 24 24" className={styles.featureIcon} aria-hidden="true">
        <path
          d="M8 12a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm8 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6ZM3 18c0-2.2 1.8-4 4-4h2c2.2 0 4 1.8 4 4"
          stroke="#2b5cff"
          strokeWidth="1.9"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13 18c0-2.2 1.8-4 4-4h0c2.2 0 4 1.8 4 4"
          stroke="#2b5cff"
          strokeWidth="1.9"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className={styles.featureIcon} aria-hidden="true">
      <path
        d="M6 5h7v14H6zM13 9h5v10h-5z"
        stroke="#0bb061"
        strokeWidth="1.9"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Authentication() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.copy}>
          <div className={styles.logoRow}>
            <InkLogo />
            <span className={styles.logoText}>InKreate</span>
          </div>
          <h1>Create Stories Together</h1>
          <p className={styles.lead}>
            Join a community of storytellers where creativity knows no bounds. Collaborate, share,
            and bring stories to life, one segment at a time.
          </p>
          <div className={styles.featureList}>
            {featurePoints.map((item) => (
              <div key={item.title} className={styles.feature}>
                <FeatureIcon type={item.icon} />
                <div>
                  <div className={styles.featureTitle}>{item.title}</div>
                  <p className={styles.featureDesc}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <AuthBox />
      </div>
    </div>
  )
}

export default Authentication
