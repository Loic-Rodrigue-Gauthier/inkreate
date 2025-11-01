
import styles from './ChatContact.module.css'

function ChatContact({src, alt='image', username, status = null}) {
  return (
    <div
      className={styles.box}>
      <div>
        <img src={src} alt={alt} />
      </div>
      <div>{username}</div>
      <div>{status}</div>
    </div>
  )
}

export default ChatContact