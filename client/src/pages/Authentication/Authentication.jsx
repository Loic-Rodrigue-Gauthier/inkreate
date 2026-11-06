import styles from "./Authentication.module.css";
import AuthBox from "../../components/AuthBox/AuthBox.jsx";
import { useI18n } from "../../context/I18nContext.jsx";

function Authentication() {
  const { t } = useI18n();

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        {/* <p className={styles.kicker}></p> */}
        <h2>{t("auth.title")}</h2>
        <p className={styles.copy}>{t("auth.desc")}</p>
        <div className={styles.features}>
          <div>
            <strong>{t("auth.card1Title")}</strong>
            <p>{t("auth.card1Desc")}</p>
          </div>
          <div>
            <strong>{t("auth.card2Title")}</strong>
            <p>{t("auth.card2Desc")}</p>
          </div>
          <div>
            <strong>{t("auth.card3Title")}</strong>
            <p>{t("auth.card3Desc")}</p>
          </div>
        </div>
      </div>
      <AuthBox />
    </div>
  );
}

export default Authentication;
