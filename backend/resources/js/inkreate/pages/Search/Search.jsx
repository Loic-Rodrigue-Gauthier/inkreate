import { useEffect, useState } from 'react';
import SearchBox from '../../components/SearchBox/SearchBox';
import StoryThumbnailList from '../../components/StoryThumbnailList/StoryThumbnailList';
import styles from './Search.module.css';
import { apiFetch, resourceData } from '../../services/apiClient.js';
import coverPlaceholder from '../../assets/cover.svg';
import avatarPlaceholder from '../../assets/avatar.svg';

const initialFilters = {
  search: '',
  genre: 'Any',
  status: 'Any',
  sort: 'popular',
};

function Search() {
  const [filters, setFilters] = useState(initialFilters);
  const [stories, setStories] = useState([]);

  const loadStories = (params) => {
    const query = { ...params };
    if (query.genre === 'Any') delete query.genre;
    if (query.status === 'Any') delete query.status;
    if (query.sort === 'default') delete query.sort;
    apiFetch('/api/stories', { params: { ...query, per_page: 12 } })
      .then((res) => {
        const data = resourceData(res);
        const mapped = data.map((story) => ({
          src: story.cover_image_url || coverPlaceholder,
          alt: 'cover',
          title: story.title,
          desc: story.synopsis || 'A collaborative story.',
          tags: story.tags || (story.genre ? [story.genre] : []),
          authors: [story.owner?.avatar_url || avatarPlaceholder],
          segments: story.segments_count ?? '—',
          views: story.reading_count ?? '—',
          comments: story.metadata?.comments ?? '—',
          rating: story.rating_average ?? '—',
          updated: story.updated_at ?? '—',
          favorited: story.favorites_count ?? '—',
          bookmarked: story.metadata?.bookmarks ?? '—',
        }));
        setStories(mapped);
      })
      .catch(() => setStories([]));
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
        <h1>Discover Stories</h1>
      </div>
      <SearchBox initialFilters={filters} onSearch={handleSearch} />
      <div className={styles.filters}>
        <span className="pill">Trending</span>
        <span>{stories.length} stories found</span>
      </div>
      <StoryThumbnailList stories={stories} />
    </div>
  );
}

export default Search;
