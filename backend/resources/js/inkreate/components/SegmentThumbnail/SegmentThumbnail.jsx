
import styles from './SegmentThumbnail.module.css'

function SegmentThumbnail({id, src, alt='image', paragraph, timestamp, views, rating, favorited, bookmarked, comments, thumbID}) {
  return (
    <div
      onClick={() => thumbID(id)}
      className={styles.main}
    >
      <img src={src} alt={alt} />
      <div className={styles.text_content}>
        <div className={styles.text}>{paragraph}</div>
        <div className={styles.date_views}>
          <div>🕓 {timestamp}</div>
          <div>👁️ {views}</div>
        </div>
        <div className={styles.stats}>
          <div>⭐ {rating}</div>
          <div>❤️ {favorited}</div>
          <div>🔖 {bookmarked}</div>
          <div>💬 {comments}</div>
        </div>
      </div>
    </div>
  )
}

export default SegmentThumbnail