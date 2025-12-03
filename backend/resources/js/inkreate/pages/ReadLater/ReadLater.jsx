import { useEffect, useState } from 'react';
import StoryThumbnailList from '../../components/StoryThumbnailList/StoryThumbnailList';
import styles from './ReadLater.module.css';
import { api, resourceData } from '../../services/apiClient';
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
          src: story.cover_image_url || coverPlaceholder,
          alt: 'cover',
          title: story.title,
          desc: story.synopsis,
          tags: story.tags || [],
          authors: [story.owner?.avatar_url || avatarPlaceholder],
          segments: story.segments_count ?? '—',
          views: story.reading_count ?? '—',
          comments: story.metadata?.comments ?? '—',
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
      <h1>Read Later</h1>
      <StoryThumbnailList stories={stories}/>
    </div>
  );
}

export default ReadLater;
