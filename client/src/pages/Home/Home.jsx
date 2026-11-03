import { useEffect, useState } from "react";
import UserStats from "../../components/UserStats/UserStats.jsx";
import StoryThumbnail from "../../components/StoryThumbnail/StoryThumbnail.jsx";
import ActivityBox from "../../components/ActivityBox/ActivityBox.jsx";
import styles from "./Home.module.css";
import avatarPlaceholder from "../../assets/avatar.svg";
import coverPlaceholder from "../../assets/cover.svg";
import { useI18n } from "../../context/I18nContext.jsx";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const aut_list = [avatarPlaceholder, avatarPlaceholder];
  const tag_list = ["fantasy", "adventure", "collaboration"];

  const [stories, setStories] = useState([
    {
      storyId: 1,
      src: "",
      alt: "image",
      title: "The Best Story Title Ever",
      desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facere, excepturi!",
      tags: ["Mystery", "Fantasy", "Romance"],
      authors: ["User"],
      segments: "97",
      views: "1051",
      comments: "0",
      rating: "4.7",
      updated: "Today",
      favorited: "942",
      bookmarked: "526",
    },
  ]);

  const [activities, setActivities] = useState([
    {
      src: "",
      alt: "image",
      username: "User",
      desc: `created a new segment in "The Best Story Title Ever"`,
      updated: "Today",
    },
  ]);

  const timeAgo = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t("time.justNow");
    if (mins < 60) return t("time.minutes").replace("{count}", mins);
    const hours = Math.floor(mins / 60);
    if (hours < 24) return t("time.hours").replace("{count}", hours);
    const days = Math.floor(hours / 24);
    if (days < 30) return t("time.days").replace("{count}", days);
    const months = Math.floor(days / 30);
    if (months < 12) return t("time.months").replace("{count}", months);
    const years = Math.floor(months / 12);
    return t("time.years").replace("{count}", years);
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>{t("home.welcomeBack")}</p>
          <h1>
            {t("home.welcomeBack")}, {"storyteller"}!
          </h1>
          <p className={styles.subtitle}>{t("home.ready")}</p>
        </div>
        <div className={styles.heroActions}>
          <button
            className="btn primary"
            onClick={() => navigate("/writeStory")}
          >
            {t("home.start")}
          </button>
          <button className="btn ghost" onClick={() => navigate("/search")}>
            {t("home.explore")}
          </button>
        </div>
      </section>

      <section className={styles.stats}>
        <UserStats
          src={avatarPlaceholder}
          alt="stories"
          number={stories.length}
          desc={t("stats.stories")}
          to="/profile?tab=contributions"
          state={{ owner: 1 }}
        />
        <UserStats
          src={avatarPlaceholder}
          alt="followers"
          number={0}
          desc={t("stats.followers")}
          to="/profile?tab=relations"
        />
        <UserStats
          src={avatarPlaceholder}
          alt="following"
          number={0}
          desc={t("stats.following")}
          to="/profile?tab=relations"
        />
        <UserStats
          src={avatarPlaceholder}
          alt="segments"
          number={stories[0].segments}
          desc={t("stats.segments")}
          to="/profile?tab=contributions"
        />
      </section>

      <section className={styles.trending}>
        <div className={styles.sectionHeader}>
          <h2>{t("home.trending")}</h2>
        </div>
        <div className={styles.storyGrid}>
          {stories.map((story, index) => (
            <StoryThumbnail key={index} {...story} />
          ))}
          {!stories.length && (
            <p style={{ color: "var(--muted)" }}>{t("home.noStories")}</p>
          )}
        </div>
      </section>

      <section className={styles.activity}>
        <h2>{t("home.activity")}</h2>
        <div className={styles.activityList}>
          {activities.map((act, idx) => (
            <ActivityBox key={idx} {...act} />
          ))}
          {!activities.length && (
            <p style={{ color: "var(--muted)" }}>{t("home.noActivity")}</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
