import { useEffect, useState } from 'react';
import StoryThumbnailList from '../../components/StoryThumbnailList/StoryThumbnailList';
import styles from './Bookmarked.module.css';
import { api, resourceData, ensureAbsoluteUrl } from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext.jsx';
import coverPlaceholder from '../../assets/cover.svg';
import avatarPlaceholder from '../../assets/avatar.svg';

function Bookmarked() {
  const { token } = useAuth();
  const [stories, setStories] = useState([]);

  const loadFavorites = () => {
    if (!token) {
      setStories([]);
      return;
    }
    api.favorites(token)
      .then((res) => {
        const data = resourceData(res);
        const mapped = data.map((story) => ({
          src: ensureAbsoluteUrl(story.cover_image_url) || coverPlaceholder,
          alt: 'cover',
          title: story.title,
          desc: story.synopsis,
          tags: story.tags || [],
          authors: [(story.owner?.avatar_url && ensureAbsoluteUrl(story.owner.avatar_url)) || avatarPlaceholder],
          segments: story.segments_count ?? '—',
          views: story.reading_count ?? story.reads_count ?? '—',
          comments: story.metrics?.comments ?? story.comments_count ?? '—',
          rating: story.rating_average ?? '—',
          updated: story.updated_at,
          favorited: story.favorites_count ?? '—',
          bookmarked: '—',
        }));
        setStories(mapped);
      })
      .catch(() => setStories([]));
  };

  useEffect(() => {
    loadFavorites();
  }, [token]);

  useEffect(() => {
    const handler = () => loadFavorites();
    window.addEventListener('favorites:update', handler);
    return () => window.removeEventListener('favorites:update', handler);
  }, [token]);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <p className={styles.kicker}>Favorites</p>
          <h1>Your bookmarked stories</h1>
          <p className={styles.subtitle}>All the stories you loved, in one place.</p>
        </div>
        <div className={styles.countCard}>
          <span className={styles.count}>{stories.length}</span>
          <span className={styles.countLabel}>saved</span>
        </div>
      </div>

      <div className={styles.content}>
        {stories.length ? (
          <StoryThumbnailList stories={stories}/>
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
