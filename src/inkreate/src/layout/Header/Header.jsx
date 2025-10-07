import { NavLink } from 'react-router-dom'
import styles from './Header.module.css'

function Header() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink
            to="/home"
            className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>
            [logo.img]
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/authentication"
            className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>
            Login/Signin
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/search"
            className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>
            Search
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/chat"
            className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>
            Chat
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/writeStory"
            className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>
            New Story
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/settings"
            className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>
            Settings
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/readStory"
            className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>
            (Reading)
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>
            (Splash)
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Header