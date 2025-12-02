
import styles from './ChatContact.module.css'

function ChatContact({onClick = null, isSelected = null, src, alt='image', username, status = null}) {
  return (
    <div
      onClick={onClick}
      className={isSelected ? styles.selected : styles.main}
    >
      <div className={styles.img_name}>
        <img
          className={styles.pic}
          src={src}
          alt={alt}
        />
        <div className={styles.user}>{username}</div>
      </div>
      <div>{status}</div>
    </div>
  )
}

export default ChatContact