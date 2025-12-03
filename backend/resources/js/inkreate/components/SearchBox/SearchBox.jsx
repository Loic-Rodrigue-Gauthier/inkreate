import { useEffect, useState } from 'react';
import styles from './SearchBox.module.css';

const GENRES = ['Any', 'Fantasy', 'Romance', 'Mystery', 'Science Fiction', 'Adventure', 'Thriller', 'Horror', 'Comedy', 'Drama'];
const SORTS = [
  { value: 'popular', label: 'Popular' },
  { value: 'rated', label: 'Top Rated' },
  { value: 'favorites', label: 'Most Favorited' },
  { value: 'recent', label: 'Recent' },
  { value: 'default', label: 'Default' },
];

function SearchBox({ initialFilters, onSearch }) {
  const [inputs, setInputs] = useState(initialFilters);

  useEffect(() => {
    setInputs(initialFilters);
  }, [initialFilters]);

  const updateValue = (e) => {
    setInputs((values) => ({ ...values, [e.target.name]: e.target.value }));
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
        placeholder="Search stories..."
        className={styles.searchInput}
      />
      <div className={styles.filters}>
        <label>
          Order
          <select name="sort" value={inputs.sort} onChange={updateValue}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Genre
          <select name="genre" value={inputs.genre} onChange={updateValue}>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select name="status" value={inputs.status} onChange={updateValue}>
            <option value="Any">Any</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="completed">Completed</option>
          </select>
        </label>
      </div>
      <div className={styles.actions}>
        <button type="submit" className="btn primary">
          Search
        </button>
      </div>
    </form>
  );
}

export default SearchBox;
