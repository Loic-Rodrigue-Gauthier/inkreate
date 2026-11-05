import styles from "./Authentication.module.css";
import AuthBox from "../../components/AuthBox/AuthBox.jsx";
import { useI18n } from "../../context/I18nContext.jsx";

function Authentication() {
  const { t } = useI18n();

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.kicker}>Create Stories Together</p>
        <h2>Create Stories Together</h2>
        <p className={styles.copy}>
          Join a community of storytellers where creativity knows no bounds.
          Collaborate, share, and bring stories to life, one segment at a time.
        </p>
        <div className={styles.features}>
          <div>
            <strong>Collaborate</strong>
            <p>Write stories together with others.</p>
          </div>
          <div>
            <strong>Connect</strong>
            <p>Follow writers and make friends.</p>
          </div>
          <div>
            <strong>Discover</strong>
            <p>Explore amazing collaborative stories.</p>
          </div>
        </div>
      </div>
      <AuthBox />
    </div>
  );
}

export default Authentication;
