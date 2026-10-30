import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { useI18n } from "../../context/I18nContext.jsx";

function Header() {
  const navigate = useNavigate();
  const { t } = useI18n();

  const handleLogout = () => {
    navigate("/authentication");
  };

  const avatarLetter = "U";

  return (
    <header className={styles.navbar}>
      <div
        onClick={() => {
          navigate("/");
        }}
        className={styles.brand}
      >
        <span className={styles.brandIcon}>🪶</span>
        <span>InKreate</span>
      </div>

      <nav className={styles.links}>
        <NavLink
          to="/home"
          className={({ isActive }) => (isActive ? styles.active : styles.link)}
        >
          <span className={styles.icon}>🏠</span> {t("nav.home")}
        </NavLink>
        <NavLink
          to="/search"
          className={({ isActive }) => (isActive ? styles.active : styles.link)}
        >
          <span className={styles.icon}>🔍</span> {t("nav.discover")}
        </NavLink>
        <NavLink
          to="/writeStory"
          className={({ isActive }) => (isActive ? styles.active : styles.link)}
        >
          <span className={styles.icon}>✏️</span> {t("nav.create")}
        </NavLink>
        <NavLink
          to="/chat"
          className={({ isActive }) => (isActive ? styles.active : styles.link)}
        >
          <span className={styles.icon}>💬</span> {t("nav.chat")}
        </NavLink>
        <NavLink
          to="/bookmarked"
          className={({ isActive }) => (isActive ? styles.active : styles.link)}
        >
          <span className={styles.icon}>⭐</span> {t("nav.favorites")}
        </NavLink>
        <NavLink
          to="/readLater"
          className={({ isActive }) => (isActive ? styles.active : styles.link)}
        >
          <span className={styles.icon}>🕒</span> {t("nav.readLater")}
        </NavLink>
        <NavLink
          to="/profile?tab=network"
          className={({ isActive }) => (isActive ? styles.active : styles.link)}
        >
          <span className={styles.icon}>📡</span> {t("nav.network")}
        </NavLink>
      </nav>

      <div className={styles.actions}>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? styles.activeIcon : styles.iconButton
          }
        >
          ⚙️
        </NavLink>
        <>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? styles.activeAvatar : styles.avatar
            }
          >
            <span>{avatarLetter}</span>
          </NavLink>
          <button className={styles.logout} onClick={handleLogout}>
            {t("nav.logout")}
          </button>
        </>
      </div>
    </header>
  );
}

export default Header;
