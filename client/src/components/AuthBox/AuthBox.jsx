import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AuthBox.module.css";
import { useI18n } from "../../context/I18nContext";

function Signin() {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  const { t } = useI18n();

  const updateValue = (e) => {
    setInputs((values) => ({ ...values, [e.target.name]: e.target.value }));
  };

  function submitForm(e) {
    e.preventDefault();
    navigate("/home");
  }

  return (
    <form onSubmit={submitForm} className={styles.form}>
      <label>
        {t("auth.username")}
        <input
          type="text"
          name="username"
          value={inputs.username ?? ""}
          onChange={updateValue}
          placeholder={t("auth.usernamePlaceholder")}
          required
        />
      </label>
      <label>
        {t("auth.email")}
        <input
          type="email"
          name="email"
          value={inputs.email ?? ""}
          onChange={updateValue}
          placeholder={t("auth.emailPlaceholder")}
          required
        />
      </label>
      <label>
        {t("auth.password")}
        <input
          type="password"
          name="password"
          value={inputs.password ?? ""}
          minLength={12}
          onChange={updateValue}
          placeholder="••••••••••••"
          required
        />
      </label>
      <button type="submit">{t("auth.signUp")}</button>
    </form>
  );
}

function Login() {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  const { t } = useI18n();

  const updateValue = (e) => {
    setInputs((values) => ({ ...values, [e.target.name]: e.target.value }));
  };

  function submitForm(e) {
    e.preventDefault();
    navigate("/home");
  }

  return (
    <form onSubmit={submitForm} className={styles.form}>
      <label>
        {t("auth.email")}
        <input
          type="email"
          name="email"
          value={inputs.email ?? ""}
          onChange={updateValue}
          placeholder={t("auth.emailPlaceholder")}
          required
        />
      </label>
      <label>
        {t("auth.password")}
        <input
          type="password"
          name="password"
          value={inputs.password ?? ""}
          minLength={12}
          onChange={updateValue}
          placeholder="••••••••••••"
          required
        />
      </label>
      <button type="submit">{t("auth.login")}</button>
    </form>
  );
}

function AuthBox() {
  const [activeTab, setActiveTab] = useState("login");
  const { t } = useI18n();

  return (
    <div className={styles.component}>
      <div className={styles.logo}>
        <span className={styles.brandIcon}>🪶</span>
        <h1>InKreate</h1>
      </div>
      <div className={styles.tabs}>
        <button
          className={activeTab === "login" ? styles.active : styles.tab}
          onClick={() => setActiveTab("login")}
        >
          {t("auth.login")}
        </button>
        <button
          className={activeTab === "signin" ? styles.active : styles.tab}
          onClick={() => setActiveTab("signin")}
        >
          {t("auth.signUp")}
        </button>
      </div>
      <div>{activeTab === "login" ? <Login /> : <Signin />}</div>
    </div>
  );
}

export default AuthBox;
