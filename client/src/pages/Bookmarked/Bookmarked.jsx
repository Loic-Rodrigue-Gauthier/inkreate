import { useEffect, useState } from "react";
import StoryThumbnailList from "../../components/StoryThumbnailList/StoryThumbnailList.jsx";
import styles from "./Bookmarked.module.css";
import coverPlaceholder from "../../assets/cover.svg";
import avatarPlaceholder from "../../assets/avatar.svg";
import { useI18n } from "../../context/I18nContext.jsx";

function Bookmarked() {
  const { t } = useI18n();

  const [stories, setStories] = useState([
    {
      storyId: 1,
      src: "",
      alt: "image",
      title: `${t("common.storyTitle")}`,
      desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facere, excepturi!",
      tags: [
        `${t("common.tagsMystery")}`,
        `${t("common.tagsFantasy")}`,
        "Romance",
      ],
      authors: ["User"],
      segments: "97",
      views: "1051",
      comments: "1",
      rating: "4.7",
      updated: `${t("common.dateToday")}`,
      favorited: "942",
      bookmarked: "526",
    },
  ]);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <p className={styles.kicker}>{t("bookmarked.heading")}</p>
          <h1>{t("bookmarked.title")}</h1>
          <p className={styles.subtitle}>{t("bookmarked.desc")}</p>
        </div>
        <div className={styles.countCard}>
          <span className={styles.count}>{stories.length}</span>
          <span className={styles.countLabel}>{t("bookmarked.saved")}</span>
        </div>
      </div>

      <div className={styles.content}>
        {stories.length ? (
          <StoryThumbnailList stories={stories} />
        ) : (
          <div className={styles.empty}>
            <p>No favorites yet.</p>
            <span>Tap the ❤️ on a story to add it here.</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookmarked;
