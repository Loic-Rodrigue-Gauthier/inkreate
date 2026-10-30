import { useEffect, useState, useRef } from "react";
import styles from "./SettingsTabs.module.css";
import { useTheme } from "../../context/ThemeContext.jsx";
import avatarPlaceholder from "../../assets/avatar.svg";
import { useI18n } from "../../context/I18nContext.jsx";

function Appearance() {
  const [inputs, setInputs] = useState({ language: "English" });
  const { theme, setTheme } = useTheme();
  const formRef = useRef(null);
  const { language, setLanguage, t } = useI18n();

  useEffect(() => {
    setInputs((prev) => ({
      ...prev,
      language: language === "fr" ? "French" : "English",
    }));
  }, [language]);

  useEffect(() => {
    setLanguage("en");
  }, [setLanguage]);

  const updateValue = (e) => {
    const { name, value } = e.target;
    if (name === "theme") {
      setTheme(value.toLowerCase());
    } else {
      setInputs((values) => ({ ...values, [name]: value }));
      setLanguage(value === "French" ? "fr" : "en");
    }
    formRef.current.requestSubmit();
  };

  function submitForm(e) {
    e.preventDefault();
    const langCode = inputs.language === "French" ? "fr" : "en";
  }

  return (
    <div className={styles.panel}>
      <form onSubmit={submitForm} ref={formRef}>
        <label>
          {t("appearance.theme")}
          <select
            name="theme"
            value={theme === "dark" ? "Dark" : "Light"}
            onChange={updateValue}
          >
            <option value="Light">{t("appearance.light")}</option>
            <option value="Dark">{t("appearance.dark")}</option>
          </select>
        </label>
        <label>
          {t("appearance.language")}
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
  );
}

function Profile() {
  const { t } = useI18n();
  const [inputs, setInputs] = useState({
    display_name: "",
    bio: "",
    preferred_genres: "",
    timezone: "UTC",
  });
  const [image, setImage] = useState(avatarPlaceholder);
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    setInputs({
      display_name: "",
      bio: "",
      preferred_genres: [].join(", "),
      timezone: "UTC",
    });
    setAvatarUrl("");
    setImage(avatarPlaceholder);
  }, []);

  const updateValue = (e) => {
    setInputs((values) => ({ ...values, [e.target.name]: e.target.value }));
  };

  return (
    <div className={styles.panel}>
      <div className={styles.actions}>
        <label>
          {t("profile.picture")}
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) =>
              e.target.files?.[0] && handleFile(e.target.files[0])
            }
          />
          <img
            src={image}
            alt="avatar"
            onError={() => setImage(avatarPlaceholder)}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              cursor: "pointer",
              objectFit: "cover",
            }}
          />
        </label>
      </div>
      <form>
        <label>
          {t("profile.displayName")}
          <input
            type="text"
            name="display_name"
            value={inputs.display_name}
            onChange={updateValue}
          />
        </label>
        <label>
          {t("profile.bio")}
          <textarea
            name="bio"
            value={inputs.bio}
            onChange={updateValue}
            placeholder="Tell collaborators about you..."
          />
        </label>
        <label>
          {t("profile.genres")}
          <input
            type="text"
            name="preferred_genres"
            value={inputs.preferred_genres}
            onChange={updateValue}
          />
        </label>
        <label>
          {t("profile.timezone")}
          <input
            type="text"
            name="timezone"
            value={inputs.timezone}
            onChange={updateValue}
          />
        </label>
        <button type="submit" className={`btn primary ${styles.save}`}>
          {t("profile.save")}
        </button>
      </form>
      <button type="submit" className={styles.danger}>
        {t("profile.delete")}
      </button>
    </div>
  );
}

function SettingsTabs() {
  const [activeTab, setActiveTab] = useState("profile");
  const { t } = useI18n();

  return (
    <div className={styles.component}>
      <h1>{t("settings.title")}</h1>
      <nav>
        <button
          className={activeTab === "profile" ? styles.active : styles.tab}
          onClick={() => setActiveTab("profile")}
        >
          {t("settings.tabs.profile")}
        </button>
        <button
          className={activeTab === "appearance" ? styles.active : styles.tab}
          onClick={() => setActiveTab("appearance")}
        >
          {t("settings.tabs.appearance")}
        </button>
      </nav>
      <div>
        {activeTab === "profile" && <Profile />}
        {activeTab === "appearance" && <Appearance />}
      </div>
    </div>
  );
}

export default SettingsTabs;
