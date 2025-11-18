
import styles from './SegmentThumbnail.module.css'

function SegmentThumbnail({id, src, alt='image', paragraph, timestamp, views, rating, favorited, bookmarked, comments, thumbID}) {
  return (
    <div
      onClick={() => thumbID(id)}
      className={styles.box}
    >
      <div>
        <img src={src} alt={alt} />
      </div>
      <div>
        <div>{paragraph}</div>
        <div>
          <div>🕓 {timestamp}</div>
          <div>👁️ {views}</div>
        </div>
        <div>
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