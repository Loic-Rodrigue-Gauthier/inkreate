
import styles from './ActiveChat.module.css';
import avatarPlaceholder from '../../assets/avatar.svg';

function ActiveChat({ onClick, isSelected, src, alt = 'avatar', username, lastMessage, timestamp, unread }) {
  const friendlyTime = timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div
      onClick={onClick}
      className={isSelected ? styles.selected : styles.box}
    >
      <img className={styles.avatar} src={src || avatarPlaceholder} alt={alt} />
      <div className={styles.meta}>
        <div className={styles.username}>{username || 'Conversation'}</div>
        <div className={styles.lastMessage}>{lastMessage || 'No messages yet.'}</div>
      </div>
      <div className={styles.timestamp}>
        {friendlyTime}
        {unread > 0 && <span className={styles.unread}>{unread}</span>}
      </div>
    </div>
  );
}

export default ActiveChat;
