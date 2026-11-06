import { useEffect, useState } from "react";
import styles from "./SearchBox.module.css";
import { useI18n } from "../../context/I18nContext.jsx";

function SearchBox({ initialFilters, onSearch, currentUserId }) {
  const [inputs, setInputs] = useState(initialFilters);
  const { t } = useI18n();

  const GENRES = [
    `${t("search.any")}`,
    `${t("common.tagsFantasy")}`,
    "Romance",
    `${t("common.tagsMystery")}`,
    "Science Fiction",
    `${t("common.tagsAdventure")}`,
    "Thriller",
    `${t("common.tagsHorror")}`,
    `${t("common.tagsComedy")}`,
    `${t("common.tagsDrama")}`,
  ];

  const SORTS = [
    { value: "popular", label: `${t("search.popular")}` },
    { value: "rated", label: `${t("search.topRated")}` },
    { value: "favorites", label: `${t("search.favorited")}` },
    { value: "recent", label: `${t("search.recent")}` },
    { value: "default", label: `${t("search.default")}` },
  ];

  useEffect(() => {
    setInputs(initialFilters);
  }, [initialFilters]);

  const updateValue = (e) => {
    setInputs((values) => ({ ...values, [e.target.name]: e.target.value }));
  };

  const toggleOwner = (e) => {
    const checked = e.target.checked;
    setInputs((values) => ({ ...values, owner: checked ? currentUserId : "" }));
  };

  function submitForm(e) {
    e.preventDefault();
    onSearch(inputs);
  }

  return (
    <form className={styles.box} onSubmit={submitForm}>
      <input
        type="text"
        name="search"
        value={inputs.search}
        onChange={updateValue}
        placeholder={t("search.placeholder")}
        className={styles.searchInput}
      />
      <div className={styles.filters}>
        <label>
          {t("search.order")}
          <select name="sort" value={inputs.sort} onChange={updateValue}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t("search.genre")}
          <select name="genre" value={inputs.genre} onChange={updateValue}>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t("search.status")}
          <select name="status" value={inputs.status} onChange={updateValue}>
            <option value="Any">{t("search.any")}</option>
            <option value="draft">{t("search.draft")}</option>
            <option value="published">{t("search.published")}</option>
            <option value="completed">{t("search.completed")}</option>
          </select>
        </label>
        {currentUserId && (
          <label className={styles.checkbox}>
            {t("search.myStories")}
            <input
              type="checkbox"
              checked={!!inputs.owner}
              onChange={toggleOwner}
            />
          </label>
        )}
      </div>
      <div className={styles.actions}>
        <button type="submit" className="btn primary">
          {t("search.button")}
        </button>
      </div>
    </form>
  );
}

export default SearchBox;
