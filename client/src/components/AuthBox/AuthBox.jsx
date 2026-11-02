import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AuthBox.module.css";

function Signin() {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();

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
        Username
        <input
          type="text"
          name="username"
          value={inputs.username ?? ""}
          onChange={updateValue}
          placeholder="Choose a username"
          required
        />
      </label>
      <label>
        Email
        <input
          type="email"
          name="email"
          value={inputs.email ?? ""}
          onChange={updateValue}
          placeholder="jane@example.com"
          required
        />
      </label>
      <label>
        Password
        <input
          type="password"
          name="password"
          value={inputs.password ?? ""}
          onChange={updateValue}
          placeholder="••••••••"
          required
        />
      </label>
      <button type="submit">Sign Up</button>
    </form>
  );
}

function Login() {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();

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
        Email
        <input
          type="email"
          name="email"
          value={inputs.email ?? ""}
          onChange={updateValue}
          placeholder="jane@example.com"
          required
        />
      </label>
      <label>
        Password
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
      <button type="submit">Login</button>
    </form>
  );
}

function AuthBox() {
  const [activeTab, setActiveTab] = useState("login");

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
          Login
        </button>
        <button
          className={activeTab === "signin" ? styles.active : styles.tab}
          onClick={() => setActiveTab("signin")}
        >
          Sign Up
        </button>
      </div>
      <div>{activeTab === "login" ? <Login /> : <Signin />}</div>
    </div>
  );
}

export default AuthBox;
