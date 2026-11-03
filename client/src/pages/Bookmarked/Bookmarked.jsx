import { useEffect, useState } from "react";
import StoryThumbnailList from "../../components/StoryThumbnailList/StoryThumbnailList.jsx";
import styles from "./Bookmarked.module.css";
import coverPlaceholder from "../../assets/cover.svg";
import avatarPlaceholder from "../../assets/avatar.svg";

function Bookmarked() {
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

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <p className={styles.kicker}>Favorites</p>
          <h1>Your bookmarked stories</h1>
          <p className={styles.subtitle}>
            All the stories you loved, in one place.
          </p>
        </div>
        <div className={styles.countCard}>
          <span className={styles.count}>{stories.length}</span>
          <span className={styles.countLabel}>saved</span>
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
