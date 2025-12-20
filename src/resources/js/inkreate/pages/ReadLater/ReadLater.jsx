import { useEffect, useState } from 'react';
import StoryThumbnailList from '../../components/StoryThumbnailList/StoryThumbnailList';
import styles from './ReadLater.module.css';
import { api, resourceData, ensureAbsoluteUrl } from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext.jsx';
import coverPlaceholder from '../../assets/cover.svg';
import avatarPlaceholder from '../../assets/avatar.svg';

function ReadLater() {
  const { token } = useAuth();
  const [stories, setStories] = useState([]);

  useEffect(() => {
    if (!token) return;
    api.readLater(token)
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
  }, [token]);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <p className={styles.kicker}>Read Later</p>
          <h1>Your queue to revisit</h1>
          <p className={styles.subtitle}>Save stories and come back when you’re ready.</p>
        </div>
        <div className={styles.countCard}>
          <span className={styles.count}>{stories.length}</span>
          <span className={styles.countLabel}>queued</span>
        </div>
      </div>

      <div className={styles.content}>
        {stories.length ? (
          <StoryThumbnailList stories={stories}/>
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
