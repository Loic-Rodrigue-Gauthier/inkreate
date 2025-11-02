
import styles from './ChatContact.module.css'

function ChatContact({onClick = null, isSelected = null, src, alt='image', username, status = null}) {
  return (
    <div
      onClick={onClick}
      className={isSelected ? styles.selected : styles.box}
    >
      <div>
        <img src={src} alt={alt} />
      </div>
      <div>{username}</div>
      <div>{status}</div>
    </div>
  )
}

export default ChatContact