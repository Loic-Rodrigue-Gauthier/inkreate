
import styles from './ActiveChat.module.css'

function ActiveChat({onClick, isSelected, src, alt='image', username, messageNumbers, lastMessage, timestamp}) {
  return (
    <div
      onClick={onClick}
      className={isSelected ? styles.selected : styles.box}>
      <div>
        <img src={src} alt={alt} />
      </div>
      <div>
        {username}
        {messageNumbers}
      </div>
      <div>{lastMessage}</div>
      <div>{timestamp} ago</div>
    </div>
  )
}

export default ActiveChat