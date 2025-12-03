
import styles from './ChatBubble.module.css'

function ChatBubble({src = null, alt='image', username, message, timestamp}) {
  return (
    <div className={styles.main}>
      <img
        className={styles.pic}
        src={src}
        alt={alt}
      />
      <div className={styles.text_content}>
        <div className={styles.user_date}>
          <div className={styles.user}>{username}</div>
          <div className={styles.date}>{timestamp}</div>
        </div>
        <div>{message}</div>
      </div>
    </div>
  )
}

export default ChatBubble