import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './AuthBox.module.css'
import viteLogo from '../../assets/vite.svg'

function Signin() {
  const [inputs, setInputs] = useState({})
  const navigate = useNavigate()

  const updateValue = (e) => {
    setInputs(values => ({...values, [e.target.name]: e.target.value}))
  }

  function submitForm(e) {
    e.preventDefault()
    // DB code here
    navigate("/home")
  }

  return (
    <form onSubmit={submitForm}>
      <label>Username:
        <input
          type="text" 
          name="username" 
          value={inputs.username}
          onChange={updateValue}
        />
      </label>
      <label>Email:
        <input
          type="text" 
          name="email" 
          value={inputs.email}
          onChange={updateValue}
        />
      </label>
      <label>Date of birth:
        <input
          type="text" 
          name="birthdate" 
          value={inputs.birthdate}
          onChange={updateValue}
        />
      </label>
      <label>Password:
        <input
          type="text" 
          name="password" 
          value={inputs.password}
          onChange={updateValue}
        />
      </label>
      <button type="submit">Sign In</button>
    </form>
  )
}

function Login() {
  const [inputs, setInputs] = useState({})
  const navigate = useNavigate()

  const updateValue = (e) => {
    setInputs(values => ({...values, [e.target.name]: e.target.value}))
  }

  function submitForm(e) {
    e.preventDefault()
    // DB code here
    navigate("/home")
  }

  return (
    <form onSubmit={submitForm}>
      <label>Email:
        <input
          type="text" 
          name="email" 
          value={inputs.email}
          onChange={updateValue}
        />
      </label>
      <label>Password:
        <input
          type="text" 
          name="password" 
          value={inputs.password}
          onChange={updateValue}
        />
      </label>
      <button type="submit">Log In</button>
    </form>
  )
}

function AuthBox() {
  const [activeTab, setActiveTab] = useState('login')

  return (
    <div className={styles.component}>
      <div>
        <img src={viteLogo} alt="viteLogo" />
        <h1>InKreate</h1>
      </div>
      <nav>
          <button
            className={activeTab === 'login' ? styles.active : styles.tab}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={activeTab === 'signin' ? styles.active : styles.tab}
            onClick={() => setActiveTab('signin')}
          >
            Signin
          </button>
      </nav>
      <div>
        {activeTab === 'login' && <Login />}
        {activeTab === 'signin' && <Signin />}
      </div>
    </div>
  )
}

export default AuthBox