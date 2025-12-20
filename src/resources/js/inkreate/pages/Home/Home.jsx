
import { useEffect, useState } from 'react';
import UserStats from '../../components/UserStats/UserStats';
import StoryThumbnail from '../../components/StoryThumbnail/StoryThumbnail';
import ActivityBox from '../../components/ActivityBox/ActivityBox';
import styles from './Home.module.css';
import avatarPlaceholder from '../../assets/avatar.svg';
import coverPlaceholder from '../../assets/cover.svg';
import { apiFetch, resourceData, ensureAbsoluteUrl } from '../../services/apiClient.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useI18n } from '../../context/I18nContext.jsx';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();
  const aut_list = [avatarPlaceholder, avatarPlaceholder];
  const tag_list = ['fantasy', 'adventure', 'collaboration'];

  const [stories, setStories] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    apiFetch('/api/stories', { params: { per_page: 6 } })
      .then((res) => {
        const data = resourceData(res);
        const mapped = data.map((story) => ({
          storyId: story.id,
          src: ensureAbsoluteUrl(story.cover_image_url) || coverPlaceholder,
          alt: 'cover',
          title: story.title,
          desc: story.synopsis || 'A collaborative story.',
          tags: story.tags || tag_list,
          authors: [(story.owner?.avatar_url && ensureAbsoluteUrl(story.owner.avatar_url)) || avatarPlaceholder],
          segments: story.metrics?.segments ?? story.segments_count ?? '—',
          views: story.metrics?.reads ?? story.reading_count ?? story.reads_count ?? '—',
          comments: story.metrics?.comments ?? story.comments_count ?? '—',
          rating: story.rating?.average ?? story.rating_average ?? '—',
          updated: story.updated_at ?? story.published_at ?? '—',
        }));
        setStories(mapped);
      })
      .catch(() => {
        setStories([]);
      });
  }, []);

  useEffect(() => {
    // Load recent stories by current user as a simple activity feed
    const ownerId = user?.id;
    apiFetch('/api/stories', { params: { per_page: 5, owner: ownerId, sort: 'recent' } })
      .then((res) => {
        const data = resourceData(res);
        const mapped = data.map((story) => ({
          src: ensureAbsoluteUrl(story.owner?.avatar_url) || avatarPlaceholder,
          username: story.owner?.display_name || story.owner?.username || 'User',
          desc: `updated “${story.title}”`,
          updated: timeAgo(story.updated_at || story.published_at || story.created_at),
        }));
        setActivities(mapped);
      })
      .catch(() => setActivities([]));
  }, [user?.id]);

  const timeAgo = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t('time.justNow');
    if (mins < 60) return t('time.minutes').replace('{count}', mins);
    const hours = Math.floor(mins / 60);
    if (hours < 24) return t('time.hours').replace('{count}', hours);
    const days = Math.floor(hours / 24);
    if (days < 30) return t('time.days').replace('{count}', days);
    const months = Math.floor(days / 30);
    if (months < 12) return t('time.months').replace('{count}', months);
    const years = Math.floor(months / 12);
    return t('time.years').replace('{count}', years);
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>{t('home.welcomeBack')}</p>
          <h1>{t('home.welcomeBack')}, {user?.display_name || user?.username || 'storyteller'}!</h1>
          <p className={styles.subtitle}>{t('home.ready')}</p>
        </div>
        <div className={styles.heroActions}>
          <button className="btn primary" onClick={() => navigate('/writeStory')}>{t('home.start')}</button>
          <button className="btn ghost" onClick={() => navigate('/search')}>{t('home.explore')}</button>
        </div>
      </section>

      <section className={styles.stats}>
        <UserStats src={avatarPlaceholder} alt="stories" number={user?.stories_count ?? 0} desc={t('stats.stories')} to="/search" state={{ owner: user?.id }} />
        <UserStats src={avatarPlaceholder} alt="followers" number={user?.followers_count ?? 0} desc={t('stats.followers')} to="/profile" />
        <UserStats src={avatarPlaceholder} alt="following" number={user?.following_count ?? 0} desc={t('stats.following')} to="/profile" />
        <UserStats src={avatarPlaceholder} alt="segments" number={user?.segments_count ?? 0} desc={t('stats.segments')} to="/read-story" />
      </section>

      <section className={styles.trending}>
        <div className={styles.sectionHeader}>
          <h2>{t('home.trending')}</h2>
        </div>
        <div className={styles.storyGrid}>
          {stories.map((story, index) => (
            <StoryThumbnail key={index} {...story} />
          ))}
          {!stories.length && (
            <p style={{ color: 'var(--muted)' }}>{t('home.noStories')}</p>
          )}
        </div>
      </section>

      <section className={styles.activity}>
        <h2>{t('home.activity')}</h2>
        <div className={styles.activityList}>
          {activities.map((act, idx) => (
            <ActivityBox key={idx} {...act} />
          ))}
          {!activities.length && (
            <p style={{ color: 'var(--muted)' }}>{t('home.noActivity')}</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
