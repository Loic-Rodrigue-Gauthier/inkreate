
import { useEffect, useState } from 'react';
import UserStats from '../../components/UserStats/UserStats';
import StoryThumbnail from '../../components/StoryThumbnail/StoryThumbnail';
import ActivityBox from '../../components/ActivityBox/ActivityBox';
import styles from './Home.module.css';
import avatarPlaceholder from '../../assets/avatar.svg';
import coverPlaceholder from '../../assets/cover.svg';
import { apiFetch, resourceData } from '../../services/apiClient.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const aut_list = [avatarPlaceholder, avatarPlaceholder];
  const tag_list = ['fantasy', 'adventure', 'collaboration'];

  const [stories, setStories] = useState([]);

  useEffect(() => {
    apiFetch('/api/stories', { params: { per_page: 6 } })
      .then((res) => {
        const data = resourceData(res);
        const mapped = data.map((story) => ({
          src: coverPlaceholder,
          alt: 'cover',
          title: story.title,
          desc: story.synopsis || 'A collaborative story.',
          tags: story.tags || tag_list,
          authors: aut_list,
          segments: story.segments_count ?? '—',
          views: story.reading_count ?? '—',
          comments: story.metadata?.comments ?? '—',
          rating: story.rating_average ?? '—',
          updated: story.updated_at ?? '—',
        }));
        setStories(mapped);
      })
      .catch(() => {
        setStories([]);
      });
  }, []);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Welcome back</p>
          <h1>Welcome back, {user?.display_name || user?.username || 'storyteller'}!</h1>
          <p className={styles.subtitle}>Ready to continue your storytelling journey?</p>
        </div>
        <div className={styles.heroActions}>
          <button className="btn primary" onClick={() => navigate('/writeStory')}>Start New Story</button>
          <button className="btn ghost" onClick={() => navigate('/search')}>Explore Stories</button>
        </div>
      </section>

      <section className={styles.stats}>
        <UserStats src={avatarPlaceholder} alt="stories" number={user?.stories_count ?? 0} desc="Stories" />
        <UserStats src={avatarPlaceholder} alt="followers" number={user?.followers_count ?? 0} desc="Followers" />
        <UserStats src={avatarPlaceholder} alt="following" number={user?.following_count ?? 0} desc="Following" />
        <UserStats src={avatarPlaceholder} alt="segments" number={user?.segments_count ?? 0} desc="Segments" />
      </section>

      <section className={styles.trending}>
        <div className={styles.sectionHeader}>
          <h2>Trending Stories</h2>
        </div>
        <div className={styles.storyGrid}>
          {stories.map((story, index) => (
            <StoryThumbnail key={index} {...story} />
          ))}
          {!stories.length && (
            <p style={{ color: 'var(--muted)' }}>No stories yet. Create your first story!</p>
          )}
        </div>
      </section>

      <section className={styles.activity}>
        <h2>Recent Activity</h2>
        <div className={styles.activityList}>
          <ActivityBox src={avatarPlaceholder} alt="image" username={user?.display_name || user?.username || 'You'} desc='added a new segment to your story' updated="today" />
        </div>
      </section>
    </div>
  );
}

export default Home;
