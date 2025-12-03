import styles from './StoryThumbnail.module.css';

function StoryThumbnail({
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
  return (
    <div className={styles.box}>
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
        <span className={styles.stat}>By:</span>
        {authors.map((item, index) => (
          <img key={index} src={item} alt="author" />
        ))}
      </div>

      <div className={styles.metaRow}>
        <span className={styles.stat}>📄 {segments} segments</span>
        <span className={styles.stat}>👀 {views}</span>
        <span className={styles.stat}>💬 {comments}</span>
        <span className={styles.stat}>⭐ {rating}</span>
      </div>

      <div className={styles.footerRow}>
        <span>Updated {updated} ago</span>
        <span className={styles.stat}>❤️ {favorited ?? '—'}</span>
        <span className={styles.stat}>🔖 {bookmarked ?? '—'}</span>
      </div>
    </div>
  );
}

export default StoryThumbnail;
