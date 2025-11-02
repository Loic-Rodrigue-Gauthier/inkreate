import { useState } from 'react'
import ChatBubble from '../ChatBubble/ChatBubble'
import ChatContact from '../ChatContact/ChatContact'
import styles from './ChatBox.module.css'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'

function ChatBox({chatId}) {
  const [value, setValue] = useState()
  const user_chat = [
    { id: 72, src: viteLogo, username: "FollowedUser3"},
    { id: 63, src: reactLogo, username: "FollowedUser4"},
  ]
  const chat_messages = [
    { id: 72, src: viteLogo, username: "FollowedUser3", message: "Lorem ipsum dolor sit amet...", timestamp: "10:10"},
    { id: 63, src: reactLogo, username: "FollowedUser4", message: "Lorem ipsum dolor sit amet...", timestamp: "20:20"},
  ]

  const updateValue = (e) => {
    setValue(e.target.value)
  }

  function submitForm(e) {
    e.preventDefault()
    // DB code here

  }

  return (
    <div>
      <div>
        {user_chat
          .filter((user) => user.id === chatId)
          .map((user, index) => (
            <ChatContact
              key={index}
              {...user}
            />
          ))}
      </div>
      <div>
        {chat_messages
          .filter((message) => message.id === chatId)
          .map((message, index) => (
            <ChatBubble
              key={index}
              {...message}
            />
          ))}
      </div>
      <div>
        <form onSubmit={submitForm}>
          <textarea
            name="message"
            value={value}
            onChange={updateValue}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  )
}

export default ChatBox