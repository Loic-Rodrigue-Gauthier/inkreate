import { useEffect, useState } from "react";
import SearchBox from "../../components/SearchBox/SearchBox.jsx";
import StoryThumbnailList from "../../components/StoryThumbnailList/StoryThumbnailList.jsx";
import styles from "./Search.module.css";
import coverPlaceholder from "../../assets/cover.svg";
import avatarPlaceholder from "../../assets/avatar.svg";
import { useLocation } from "react-router-dom";
import { useI18n } from "../../context/I18nContext.jsx";

const initialFilters = {
  search: "",
  genre: "Any",
  status: "Any",
  sort: "popular",
  owner: "",
};

function Search() {
  const location = useLocation();
  const { t } = useI18n();
  const initialOwner =
    location.state?.owner ||
    new URLSearchParams(location.search).get("owner") ||
    "";
  const [filters, setFilters] = useState({
    ...initialFilters,
    owner: initialOwner,
  });
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

  const loadStories = (params) => {
    const query = { ...params };
    if (query.genre === "Any") delete query.genre;
    if (query.status === "Any") delete query.status;
    if (query.sort === "default") delete query.sort;
    if (!query.owner) delete query.owner;
  };

  useEffect(() => {
    loadStories(filters);
  }, []);

  const handleSearch = (nextFilters) => {
    setFilters(nextFilters);
    loadStories(nextFilters);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>{t("search.title")}</h1>
      </div>
      <SearchBox
        initialFilters={filters}
        // onSearch={handleSearch}
        currentUserId={1}
      />
      <div className={styles.filters}>
        <span className="pill">{t("search.trending")}</span>
        <span>
          {t("search.results", { count: stories.length }).replace(
            "{count}",
            stories.length,
          )}
        </span>
      </div>
      <div>
        <StoryThumbnailList stories={stories} />
        {!stories.length && (
          <p style={{ color: "var(--muted)" }}>{t("search.none")}</p>
        )}
      </div>
    </div>
  );
}

export default Search;
