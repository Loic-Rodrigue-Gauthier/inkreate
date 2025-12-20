import { useEffect, useState } from 'react';
import SearchBox from '../../components/SearchBox/SearchBox';
import StoryThumbnailList from '../../components/StoryThumbnailList/StoryThumbnailList';
import styles from './Search.module.css';
import { apiFetch, resourceData, ensureAbsoluteUrl } from '../../services/apiClient.js';
import coverPlaceholder from '../../assets/cover.svg';
import avatarPlaceholder from '../../assets/avatar.svg';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useI18n } from '../../context/I18nContext.jsx';

const initialFilters = {
  search: '',
  genre: 'Any',
  status: 'Any',
  sort: 'popular',
  owner: '',
};

function Search() {
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useI18n();
  const initialOwner = location.state?.owner || new URLSearchParams(location.search).get('owner') || '';
  const [filters, setFilters] = useState({ ...initialFilters, owner: initialOwner });
  const [stories, setStories] = useState([]);

  const loadStories = (params) => {
    const query = { ...params };
    if (query.genre === 'Any') delete query.genre;
    if (query.status === 'Any') delete query.status;
    if (query.sort === 'default') delete query.sort;
    if (!query.owner) delete query.owner;
    apiFetch('/api/stories', { params: { ...query, per_page: 12 } })
      .then((res) => {
        const data = resourceData(res);
        const mapped = data.map((story) => ({
          storyId: story.id,
          src: ensureAbsoluteUrl(story.cover_image_url) || coverPlaceholder,
          alt: 'cover',
          title: story.title,
          desc: story.synopsis || 'A collaborative story.',
          tags: story.tags || (story.genre ? [story.genre] : []),
          authors: [(story.owner?.avatar_url && ensureAbsoluteUrl(story.owner.avatar_url)) || avatarPlaceholder],
          segments: story.metrics?.segments ?? story.segments_count ?? '—',
          views: story.metrics?.reads ?? story.reading_count ?? story.reads_count ?? '—',
          comments: story.metrics?.comments ?? story.comments_count ?? '—',
          rating: story.rating?.average ?? story.rating_average ?? '—',
          updated: story.updated_at ?? story.published_at ?? '—',
          favorited: story.metrics?.favorites ?? story.favorites_count ?? '—',
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
        <h1>{t('search.title')}</h1>
      </div>
      <SearchBox initialFilters={filters} onSearch={handleSearch} currentUserId={user?.id} />
      <div className={styles.filters}>
        <span className="pill">{t('search.trending')}</span>
        <span>{t('search.results', { count: stories.length }).replace('{count}', stories.length)}</span>
      </div>
      <StoryThumbnailList stories={stories} />
      {!stories.length && <p style={{ color: 'var(--muted)' }}>{t('search.none')}</p>}
    </div>
  );
}

export default Search;
