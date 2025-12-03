import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './AuthBox.module.css'

function LoginForm() {
  const [inputs, setInputs] = useState({ email: '', password: '' })
  const navigate = useNavigate()

  const updateValue = (e) => {
    setInputs((values) => ({ ...values, [e.target.name]: e.target.value }))
  }

  function submitForm(e) {
    e.preventDefault()
    navigate('/home')
  }

  return (
    <form onSubmit={submitForm} className={styles.form}>
      <label className={styles.label}>
        <span>Email</span>
        <input
          type="email"
          name="email"
          placeholder="jane@example.com"
          value={inputs.email}
          onChange={updateValue}
        />
      </label>
      <label className={styles.label}>
        <span>Password</span>
        <input
          type="password"
          name="password"
          placeholder="•••••••"
          value={inputs.password}
          onChange={updateValue}
        />
      </label>
      <button type="submit" className={styles.primaryBtn}>
        Login
      </button>
    </form>
  )
}

function SignupForm() {
  const [inputs, setInputs] = useState({ email: '', password: '', username: '' })
  const navigate = useNavigate()

  const updateValue = (e) => {
    setInputs((values) => ({ ...values, [e.target.name]: e.target.value }))
  }

  function submitForm(e) {
    e.preventDefault()
    navigate('/home')
  }

  return (
    <form onSubmit={submitForm} className={styles.form}>
      <label className={styles.label}>
        <span>Username</span>
        <input
          type="text"
          name="username"
          placeholder="yourname"
          value={inputs.username}
          onChange={updateValue}
        />
      </label>
      <label className={styles.label}>
        <span>Email</span>
        <input
          type="email"
          name="email"
          placeholder="jane@example.com"
          value={inputs.email}
          onChange={updateValue}
        />
      </label>
      <label className={styles.label}>
        <span>Password</span>
        <input
          type="password"
          name="password"
          placeholder="•••••••"
          value={inputs.password}
          onChange={updateValue}
        />
      </label>
      <button type="submit" className={styles.primaryBtn}>
        Sign Up
      </button>
    </form>
  )
}

function AuthBox() {
  const [activeTab, setActiveTab] = useState('login')
  const tabs = [
    { id: 'login', label: 'Login' },
    { id: 'signup', label: 'Sign Up' },
  ]

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.heading}>Welcome to InKreate</div>
        <p className={styles.subheading}>
          Sign in to your account or create a new one to start your storytelling journey
        </p>
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Authentication tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={activeTab === tab.id ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.formHolder}>
        {activeTab === 'login' && <LoginForm />}
        {activeTab === 'signup' && <SignupForm />}
      </div>

      <p className={styles.hint}>
        Demo: Use any email from the user list (jane@example.com, alex@example.com, sam@example.com)
      </p>
    </div>
  )
}

export default AuthBox
