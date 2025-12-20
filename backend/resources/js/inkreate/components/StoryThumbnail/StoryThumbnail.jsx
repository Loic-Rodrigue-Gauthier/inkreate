import styles from './StoryThumbnail.module.css';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useI18n } from '../../context/I18nContext.jsx';

const formatRelativeTime = (value, t) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return t('time.justNow');
  if (diffMinutes < 60) return t('time.minutes').replace('{count}', diffMinutes);
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return t('time.hours').replace('{count}', diffHours);
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return t('time.days').replace('{count}', diffDays);
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return t('time.months').replace('{count}', diffMonths);
  const diffYears = Math.floor(diffMonths / 12);
  return t('time.years').replace('{count}', diffYears);
};

function StoryThumbnail({
  storyId,
  src,
  alt = 'image',
  title,
  desc,
  tags = [],
  authors = [],
  segments,
  views,
  comments,
  rating,
  updated,
  favorited,
  bookmarked,
}) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const updatedLabel = useMemo(() => formatRelativeTime(updated, t), [updated, t]);

  const handleClick = () => {
    if (storyId) {
      navigate(`/read-story/${storyId}`);
    }
  };

  return (
    <div className={styles.box} onClick={handleClick} role="button" tabIndex={0}>
      <div className={styles.cover}>
        <img src={src} alt={alt} />
      </div>

      <div className={styles.titleRow}>
        <h3>{title}</h3>
        {tags[0] && <span className={styles.badge}>{tags[0]}</span>}
      </div>

      <p className={styles.desc}>{desc}</p>

      <div className={styles.tagRow}>
        {tags.map((item, index) => (
          <span key={index} className={styles.tag}>
            {item}
          </span>
        ))}
      </div>

      <div className={`${styles.tagRow} ${styles.authors}`}>
        <span className={styles.stat}>{t('thumbnail.by')}:</span>
        {authors.map((item, index) => (
          <img key={index} src={item} alt="author" />
        ))}
      </div>

      <div className={styles.metaRow}>
        <span className={styles.stat}>📄 {segments} {t('thumbnail.segments')}</span>
        <span className={styles.stat}>👀 {views} {t('thumbnail.views')}</span>
        <span className={styles.stat}>💬 {comments} {t('thumbnail.comments')}</span>
        <span className={styles.stat}>⭐ {rating} {t('thumbnail.rating')}</span>
      </div>

      <div className={styles.footerRow}>
        <span>{t('thumbnail.updated')} {updatedLabel}</span>
        <span className={styles.stat}>❤️ {favorited ?? '—'}</span>
        <span className={styles.stat}>🔖 {bookmarked ?? '—'}</span>
      </div>
    </div>
  );
}

export default StoryThumbnail;
