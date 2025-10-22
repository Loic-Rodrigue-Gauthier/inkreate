import { useState, useRef } from 'react'
import CheckboxOption from '../CheckboxOption/CheckboxOption'
import styles from './SettingsTabs.module.css'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'

function Privacy() {
  const [inputs, setInputs] = useState({})
  const formRef = useRef(null)

  const updateValue = (e) => {
    const { name, value } = e.target
    setInputs(values => ({...values, [name]: value}))
    formRef.current.requestSubmit()
  }

  function submitForm(e) {
    e.preventDefault()
    // DB code here

  }

  return (
    <div>
      <form
        onSubmit={submitForm}
        ref={formRef}
      >
        <label>Profile:
          <select 
            name="profile"
            value={inputs.profile}
            onChange={updateValue}
          >
            <option value="Public">Public</option>
            <option value="Followers">Followers</option>
            <option value="Private">Private</option>
          </select>
        </label>
        <label>Stories:
          <select 
            name="stories"
            value={inputs.stories}
            onChange={updateValue}
          >
            <option value="Public">Public</option>
            <option value="Followers">Followers</option>
            <option value="Private">Private</option>
          </select>
        </label>
        <label>Who?:
          <select 
            name="chat"
            value={inputs.chat}
            onChange={updateValue}
          >
            <option value="Anyone">Anyone</option>
            <option value="Followers">Followers</option>
            <option value="No One">No One</option>
          </select>
        </label>
        <label>Status:
          <select 
            name="status"
            value={inputs.status}
            onChange={updateValue}
          >
            <option value="Visible">Visible</option>
            <option value="Invisible">Invisible</option>
          </select>
        </label>
      </form>
    </div>
  )
}

function Notifications() {
  return (
    <>
      <CheckboxOption src={reactLogo} title="Lorem" desc="Lorem ipsum dolor sit amet." option="1" />
      <CheckboxOption src={viteLogo} title="Lorem" desc="Lorem ipsum dolor sit amet." option="2" />
      <CheckboxOption src={reactLogo} title="Lorem" desc="Lorem ipsum dolor sit amet." option="3" />
      <CheckboxOption src={viteLogo} title="Lorem" desc="Lorem ipsum dolor sit amet." option="4" />
    </>
  )
}

function Display() {
  const [inputs, setInputs] = useState({theme:"Light", language:"English"})
  const formRef = useRef(null)

  const updateValue = (e) => {
    const { name, value } = e.target
    setInputs(values => ({...values, [name]: value}))
    formRef.current.requestSubmit()
  }

  function submitForm(e) {
    e.preventDefault()
    // DB code here

  }

  return (
    <div>
      <form
        onSubmit={submitForm}
        ref={formRef}
      >
        <label>Theme:
          <select 
            name="theme"
            value={inputs.theme}
            onChange={updateValue}
          >
            <option value="Light">Light</option>
            <option value="Dark">Dark</option>
            <option value="System">System</option>
          </select>
        </label>
        <label>Language:
          <select 
            name="language"
            value={inputs.language}
            onChange={updateValue}
          >
            <option value="English">English</option>
            <option value="French">French</option>
          </select>
        </label>
      </form>
    </div>
  )
}

function Profile() {
  const [inputs, setInputs] = useState({})
  const [image, setImage] = useState(reactLogo)

  const updateValue = (e) => {
    setInputs(values => ({...values, [e.target.name]: e.target.value}))
  }

  const updateImage = () => {
    // Open/Browse dialog box here

    setImage(viteLogo)
    // DB code here

  }

  function submitForm(e) {
    e.preventDefault()
    // DB code here

  }

  return (
    <div>
      <div>
        <label>Profile Picture:
          <img src={image} alt="pp" onClick={updateImage}/>
        </label>
      </div>
      <form onSubmit={submitForm}>
        <label>Bio:
          <textarea
            name="bio" 
            value={inputs.bio}
            onChange={updateValue}
          />
        </label>
        <h4>Email</h4>
        <label>Current email:
          <input
            type="text" 
            name="old_email" 
            value={inputs.old_email}
            onChange={updateValue}
          />
        </label>
        <label>New email:
          <input
            type="text" 
            name="new_email" 
            value={inputs.new_email}
            onChange={updateValue}
          />
        </label>
        <h4>Password</h4>
          <label>Current password:
          <input
            type="text" 
            name="old_password" 
            value={inputs.old_password}
            onChange={updateValue}
          />
        </label>
        <label>New password:
          <input
            type="text" 
            name="new_password" 
            value={inputs.new_password}
            onChange={updateValue}
          />
        </label>
        <button type="submit">
          <img src={viteLogo} alt="save" />
          Save Changes
        </button>
      </form>
      <button>Delete Account</button>
    </div>
  )
}

function SettingsTabs() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className={styles.component}>
      <h1>Settings</h1>
      <nav>
          <button
            className={activeTab === 'profile' ? styles.active : styles.tab}
            onClick={() => setActiveTab('profile')}
          >
            <img src={reactLogo} alt="profile" />
            Profile
          </button>
          <button
            className={activeTab === 'display' ? styles.active : styles.tab}
            onClick={() => setActiveTab('display')}
          >
            <img src={viteLogo} alt="display" />
            Display
          </button>
          <button
            className={activeTab === 'notifications' ? styles.active : styles.tab}
            onClick={() => setActiveTab('notifications')}
          >
            <img src={reactLogo} alt="notifications" />
            Notifications
          </button>
          <button
            className={activeTab === 'privacy' ? styles.active : styles.tab}
            onClick={() => setActiveTab('privacy')}
          >
            <img src={viteLogo} alt="privacy" />
            Privacy
          </button>
      </nav>
      <div>
        {activeTab === 'profile' && <Profile />}
        {activeTab === 'display' && <Display />}
        {activeTab === 'notifications' && <Notifications />}
        {activeTab === 'privacy' && <Privacy />}
      </div>
    </div>
  )
}

export default SettingsTabs