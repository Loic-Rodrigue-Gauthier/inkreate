
import styles from './ActiveChat.module.css'
import avatarPlaceholder from '../../assets/avatar.svg'

function ActiveChat({onClick, isSelected, src, alt='image', username, messageNumbers, lastMessage, timestamp}) {
  return (
    <div
      onClick={onClick}
      className={isSelected ? styles.selected : styles.box}>
      <div>
        <img src={src || avatarPlaceholder} alt={alt} />
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
