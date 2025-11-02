
import styles from './ChatBubble.module.css'

function ChatBubble({src = null, alt='image', username, message, timestamp}) {
  return (
    <div>
      <div>
        <img src={src} alt={alt} />
      </div>
      <div>
        {username}
      </div>
      <div>{message}</div>
      <div>{timestamp}</div>
    </div>
  )
}

export default ChatBubble