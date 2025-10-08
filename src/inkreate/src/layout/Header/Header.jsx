import { NavLink } from 'react-router-dom'
import styles from './Header.module.css'
import viteLogo from '../../assets/vite.svg'

function Header() {
  return (
    <nav>
      <ul className={styles.menu}>
        <li className={styles.page}>
          <NavLink
            to="/home"
            className={({ isActive }) => isActive ? styles.active : styles.navLink}>
            <img src={viteLogo} alt="viteLogo" />
          </NavLink>
        </li>
        <li className={styles.page}>
          <NavLink
            to="/authentication"
            className={({ isActive }) => isActive ? styles.active : styles.navLink}>
            Login/Signin
          </NavLink>
        </li>
        <li className={styles.page}>
          <NavLink
            to="/search"
            className={({ isActive }) => isActive ? styles.active : styles.navLink}>
            Search
          </NavLink>
        </li>
        <li className={styles.page}>
          <NavLink
            to="/chat"
            className={({ isActive }) => isActive ? styles.active : styles.navLink}>
            Chat
          </NavLink>
        </li>
        <li className={styles.page}>
          <NavLink
            to="/writeStory"
            className={({ isActive }) => isActive ? styles.active : styles.navLink}>
            New Story
          </NavLink>
        </li>
        <li className={styles.page}>
          <NavLink
            to="/profile"
            className={({ isActive }) => isActive ? styles.active : styles.navLink}>
            Profile
          </NavLink>
        </li>
        <li className={styles.page}>
          <NavLink
            to="/settings"
            className={({ isActive }) => isActive ? styles.active : styles.navLink}>
            Settings
          </NavLink>
        </li>
        <li className={styles.page}>
          <NavLink
            to="/readStory"
            className={({ isActive }) => isActive ? styles.active : styles.navLink}>
            (Reading)
          </NavLink>
        </li>
        <li className={styles.page}>
          <NavLink
            to="/"
            className={({ isActive }) => isActive ? styles.active : styles.navLink}>
            (Splash)
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Header