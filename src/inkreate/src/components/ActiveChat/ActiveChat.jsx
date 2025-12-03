
import styles from './ActiveChat.module.css'

function ActiveChat({onClick, isSelected, src, alt='image', username, messageNumbers = null, lastMessage, timestamp}) {
  return (
    <div
      onClick={onClick}
      className={isSelected ? styles.selected : styles.main}>
      <div>
        <img src={src} alt={alt} />
      </div>
      <div className={styles.content}>
        <div className={styles.user_number}>
          <div className={styles.user}>{username}</div>
          <div className={messageNumbers && styles.number}>{messageNumbers}</div>
        </div>
        <div className={styles.text}>{lastMessage}</div>
        <div>{timestamp} ago</div>
      </div>
    </div>
  )
}

export default ActiveChat