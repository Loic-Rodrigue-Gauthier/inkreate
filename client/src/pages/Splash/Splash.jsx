import { useNavigate } from "react-router-dom";
import styles from "./Splash.module.css";
import ImageTitleText from "../../components/ImageTitleText/ImageTitleText";
import NumberedTitleText from "../../components/NumberedTitleText/NumberedTitleText";
import GlobalStats from "../../components/GlobalStats/GlobalStats";
import avatarPlaceholder from "../../assets/avatar.svg";
import heroTexture from "../../assets/bliss.jpg";
import { useI18n } from "../../context/I18nContext.jsx";

function Splash() {
  const navigate = useNavigate();
  const { t } = useI18n();

  const goToPage = () => {
    navigate("/authentication");
  };

  const testimonials = [
    {
      name: "Sarah M.",
      title: `${t("splash.titleSarah")}`,
      quote: `${t("splash.testSarah")}`,
    },
    {
      name: "Mark A.",
      title: `${t("splash.titleMark")}`,
      quote: `${t("splash.testMark")}`,
    },
    {
      name: "Emily R.",
      title: `${t("splash.titleEmily")}`,
      quote: `${t("splash.testEmily")}`,
    },
  ];

  return (
    <div className={styles.page}>
      <section
        className={styles.hero}
        style={{ "--hero-bg": `url(${heroTexture})` }}
      >
        <div className={styles.heroText}>
          <div className={styles.logoRow}>
            <div className={styles.logoMark}>🪶</div>
            <h1>InKreate</h1>
          </div>
          <h2>{t("splash.title")}</h2>
          <p>{t("splash.desc")}</p>
          <div className={styles.ctaRow}>
            <button className="btn primary" onClick={goToPage}>
              {t("splash.startButton")}
            </button>
            <button className="btn ghost">
              <a href="#featuresSection">{t("splash.exploreButton")}</a>
            </button>
          </div>
          <div className={styles.statsRow}>
            <GlobalStats
              number={t("splash.statsActiveCount")}
              desc={t("splash.statsActive")}
            />
            <GlobalStats
              number={t("splash.statsStory1Count")}
              desc={t("splash.statsStory1")}
            />
            <GlobalStats
              number={t("splash.statsStory2Count")}
              desc={t("splash.statsStory2")}
            />
          </div>
        </div>
        <div className={styles.heroCard}>
          <p className={styles.heroOverline}>{t("splash.joinHeader")}</p>
          <h3>{t("splash.joinDesc")}</h3>
          <div className={styles.heroActions}>
            <button className="btn primary" onClick={goToPage}>
              {t("splash.joinButton")}
            </button>
            <button className="btn ghost" onClick={goToPage}>
              {t("splash.seeButton")}
            </button>
          </div>
        </div>
      </section>

      <section id="featuresSection" className={styles.features}>
        <div className={styles.sectionHeader}>
          <h3>{t("splash.whyTitle")}</h3>
          <p className={styles.subtext}>{t("splash.whyDesc")}</p>
        </div>
        <div className={styles.featureGrid}>
          <ImageTitleText
            src={avatarPlaceholder}
            title={t("splash.cardCollabTitle")}
          >
            <p>{t("splash.cardCollabDesc")}</p>
          </ImageTitleText>
          <ImageTitleText
            src={avatarPlaceholder}
            title={t("splash.cardSocialTitle")}
          >
            <p>{t("splash.cardSocialDesc")}</p>
          </ImageTitleText>
          <ImageTitleText
            src={avatarPlaceholder}
            title={t("splash.cardRealTitle")}
          >
            <p>{t("splash.cardRealDesc")}</p>
          </ImageTitleText>
          <ImageTitleText
            src={avatarPlaceholder}
            title={t("splash.cardStoryTitle")}
          >
            <p>{t("splash.cardStoryDesc")}</p>
          </ImageTitleText>
          <ImageTitleText
            src={avatarPlaceholder}
            title={t("splash.cardReadTitle")}
          >
            <p>{t("splash.cardReadDesc")}</p>
          </ImageTitleText>
          <ImageTitleText
            src={avatarPlaceholder}
            title={t("splash.cardRateTitle")}
          >
            <p>{t("splash.cardRateDesc")}</p>
          </ImageTitleText>
        </div>
      </section>

      <section className={styles.steps}>
        <div className={styles.sectionHeader}>
          <h3>{t("splash.howTitle")}</h3>
          <p className={styles.subtext}>{t("splash.howDesc")}</p>
        </div>
        <div className={styles.stepGrid}>
          <NumberedTitleText number="1" title={t("splash.step1Title")}>
            <p>{t("splash.step1Desc")}</p>
          </NumberedTitleText>
          <NumberedTitleText number="2" title={t("splash.step2Title")}>
            <p>{t("splash.step2Desc")}</p>
          </NumberedTitleText>
          <NumberedTitleText number="3" title={t("splash.step3Title")}>
            <p>{t("splash.step3Desc")}</p>
          </NumberedTitleText>
        </div>
      </section>

      <section className={styles.testimonials}>
        <div className={styles.sectionHeader}>
          <h3>{t("splash.whatTitle")}</h3>
          <p className={styles.subtext}>{t("splash.whatDesc")}</p>
        </div>
        <div className={styles.testimonialGrid}>
          {testimonials.map((item, idx) => (
            <div key={idx} className={styles.testimonialCard}>
              <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
              <p className={styles.quote}>"{item.quote}"</p>
              <div className={styles.author}>{item.name}</div>
              <div className={styles.role}>{item.title}</div>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.footerCta}>
        <div>
          <h3>{t("splash.footerTitle")}</h3>
          <p className={styles.subtext}>{t("splash.footerDesc")}</p>
        </div>
        <button className="btn primary" onClick={goToPage}>
          {t("splash.joinButton")}
        </button>
      </div>
    </div>
  );
}

export default Splash;
