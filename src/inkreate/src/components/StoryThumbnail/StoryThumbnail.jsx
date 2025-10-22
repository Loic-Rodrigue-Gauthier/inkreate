
import styles from './StoryThumbnail.module.css'

function StoryThumbnail({src, alt='image', title, desc, tags, authors, segments, views, comments, rating, updated}) {
  return (
    <div className={styles.box}>
      <div>
        <img src={src} alt={alt} />
      </div>
      <h3>{title}</h3>
      <div>{desc}</div>
      <div>
        {tags.map((item, index) =>
          <div key={index}>{item}</div>
        )}
      </div>
      <div>
        By:
        {authors.map((item, index) =>
          <div key={index}><img src={item}/></div>
        )}
      </div>
      <div>
        <div>📖 {segments}</div>
        <div>👁️ {views}</div>
        <div>💬 {comments}</div>
        <div>⭐ {rating}</div>
      </div>
      <div>
        <div>🕓 Updated {updated} ago</div>
        {/* <button>❤️</button>
        <button>🔖</button> */}
      </div>
    </div>
  )
}

export default StoryThumbnail