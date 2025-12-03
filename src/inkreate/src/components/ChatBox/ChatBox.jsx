import { useState, useEffect, useRef } from 'react'
import ChatBubble from '../ChatBubble/ChatBubble'
import ChatContact from '../ChatContact/ChatContact'
import styles from './ChatBox.module.css'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'
import pfp from '../../assets/pfp.svg'

function ChatBox({chatId, userList}) {
  const chatRef = useRef(null);
  const [value, setValue] = useState()
  const [chatMess, setChatMess] = useState([
    { id: 72, src: viteLogo, username: "FollowedUser3", message: "Lorem ipsum dolor sit amet!", timestamp: "10:10"},
    { id: 63, src: reactLogo, username: "FollowedUser4", message: "Lorem ipsum dolor sit amet!", timestamp: "20:20"},
  ])

  const updateValue = (e) => {
    setValue(e.target.value)
  }

  function submitForm(e) {
    e.preventDefault()
    // DB code here

    const newMess = { id: chatId, src: pfp, username: "LoggedInUser", message: value, timestamp: "just now"}
    setChatMess(prev => [...prev, newMess])
    setValue("")
  }

  useEffect(() => {
    const el = chatRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [chatMess]);

  return (
    <div className={styles.main}>
      <div>
        {userList
          .filter((user) => user.id === chatId)
          .map((user, index) => (
            <ChatContact
              key={index}
              {...user}
            />
          ))}
      </div>
      <div ref={chatRef} className={styles.chat_mess}>
        {chatMess
          .filter((message) => message.id === chatId)
          .map((message, index) => (
            <ChatBubble
              key={index}
              {...message}
            />
          ))}
      </div>
      <div className={styles.chat_area}>
        <form onSubmit={submitForm}>
          <textarea
            name="message"
            value={value}
            onChange={updateValue}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submitForm(e)
              }
            }}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  )
}

export default ChatBox