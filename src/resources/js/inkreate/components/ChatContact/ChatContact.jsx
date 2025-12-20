
import styles from './ChatContact.module.css';
import avatarPlaceholder from '../../assets/avatar.svg';

function ChatContact({onClick = null, isSelected = null, src, alt='image', username, status = null}) {
  const avatarSrc = src || avatarPlaceholder;

  return (
    <div
      onClick={onClick}
      className={isSelected ? styles.selected : styles.main}
    >
      <img
        className={styles.pic}
        src={avatarSrc}
        alt={alt}
      />
      <div className={styles.user}>{username}</div>
      {status && <div className={styles.status}>{status}</div>}
    </div>
  )
}

export default ChatContact
