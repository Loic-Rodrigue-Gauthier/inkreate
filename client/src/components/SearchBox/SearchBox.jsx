import { useEffect, useState } from 'react';
import styles from './SearchBox.module.css';
import { useI18n } from '../../context/I18nContext.jsx';

const GENRES = ['Any', 'Fantasy', 'Romance', 'Mystery', 'Science Fiction', 'Adventure', 'Thriller', 'Horror', 'Comedy', 'Drama'];
const SORTS = [
  { value: 'popular', label: 'Popular' },
  { value: 'rated', label: 'Top Rated' },
  { value: 'favorites', label: 'Most Favorited' },
  { value: 'recent', label: 'Recent' },
  { value: 'default', label: 'Default' },
];

function SearchBox({ initialFilters, onSearch, currentUserId }) {
  const [inputs, setInputs] = useState(initialFilters);
  const { t } = useI18n();

  useEffect(() => {
    setInputs(initialFilters);
  }, [initialFilters]);

  const updateValue = (e) => {
    setInputs((values) => ({ ...values, [e.target.name]: e.target.value }));
  };

  const toggleOwner = (e) => {
    const checked = e.target.checked;
    setInputs((values) => ({ ...values, owner: checked ? currentUserId : '' }));
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
        placeholder={t('search.placeholder')}
        className={styles.searchInput}
      />
      <div className={styles.filters}>
        <label>
          {t('search.order')}
          <select name="sort" value={inputs.sort} onChange={updateValue}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t('search.genre')}
          <select name="genre" value={inputs.genre} onChange={updateValue}>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t('search.status')}
          <select name="status" value={inputs.status} onChange={updateValue}>
            <option value="Any">Any</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        {currentUserId && (
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={!!inputs.owner}
              onChange={toggleOwner}
            />
            {t('search.myStories')}
          </label>
        )}
      </div>
      <div className={styles.actions}>
        <button type="submit" className="btn primary">
          {t('search.button')}
        </button>
      </div>
    </form>
  );
}

export default SearchBox;
