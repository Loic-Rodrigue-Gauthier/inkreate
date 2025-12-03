import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { useAuth } from '../../context/AuthContext.jsx';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/authentication');
  };

  const avatarLetter =
    user?.display_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U';

  return (
    <header className={styles.navbar}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>🪶</span>
        <span>InKreate</span>
      </div>

      <nav className={styles.links}>
        <NavLink to="/home" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
          <span className={styles.icon}>🏠</span> Home
        </NavLink>
        <NavLink
          to="/search"
          className={({ isActive }) => (isActive ? styles.active : styles.link)}
        >
          <span className={styles.icon}>🔍</span> Discover
        </NavLink>
        <NavLink
          to="/writeStory"
          className={({ isActive }) => (isActive ? styles.active : styles.link)}
        >
          <span className={styles.icon}>✏️</span> Create Story
        </NavLink>
        <NavLink
          to="/read-story"
          className={({ isActive }) => (isActive ? styles.active : styles.link)}
        >
          <span className={styles.icon}>📖</span> Read Story
        </NavLink>
        <NavLink to="/chat" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
          <span className={styles.icon}>💬</span> Chat
        </NavLink>
        <NavLink
          to="/readLater"
          className={({ isActive }) => (isActive ? styles.active : styles.link)}
        >
          <span className={styles.icon}>🕒</span> Read Later
        </NavLink>
      </nav>

      <div className={styles.actions}>
        <NavLink
          to="/settings"
          className={({ isActive }) => (isActive ? styles.activeIcon : styles.iconButton)}
        >
          ⚙️
        </NavLink>
        {user ? (
          <>
            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? styles.activeAvatar : styles.avatar)}
            >
              <span>{avatarLetter}</span>
            </NavLink>
            <button className={styles.logout} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/authentication" className={styles.login}>
            Login
          </NavLink>
        )}
      </div>
    </header>
  );
}

export default Header;
