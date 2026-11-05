import { useEffect, useState } from "react";
import StoryThumbnailList from "../../components/StoryThumbnailList/StoryThumbnailList.jsx";
import styles from "./ReadLater.module.css";
import coverPlaceholder from "../../assets/cover.svg";
import avatarPlaceholder from "../../assets/avatar.svg";
import { useI18n } from "../../context/I18nContext.jsx";

function ReadLater() {
  const { t } = useI18n();

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
      comments: "1",
      rating: "4.7",
      updated: "Today",
      favorited: "942",
      bookmarked: "526",
    },
  ]);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <p className={styles.kicker}>Read Later</p>
          <h1>Your queue to revisit</h1>
          <p className={styles.subtitle}>
            Save stories and come back when you’re ready.
          </p>
        </div>
        <div className={styles.countCard}>
          <span className={styles.count}>{stories.length}</span>
          <span className={styles.countLabel}>queued</span>
        </div>
      </div>

      <div className={styles.content}>
        {stories.length ? (
          <StoryThumbnailList stories={stories} />
        ) : (
          <div className={styles.empty}>
            <p>No stories in your queue.</p>
            <span>Click “Read later” on a story to keep it here.</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReadLater;
