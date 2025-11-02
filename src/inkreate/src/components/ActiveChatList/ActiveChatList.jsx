import { useState } from 'react'
import styles from './ActiveChatList.module.css'
import SearchChat from '../SearchChat/SearchChat'
import ActiveChat from '../ActiveChat/ActiveChat'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'

function ActiveChatList({onSelect}) {
  const [activeChat, setActiveChat] = useState(0)
  const active_chat = [
    { id: 72, src: viteLogo, username: "FollowedUser3", messageNumbers: 2, lastMessage: "Lorem ipsum dolor sit amet...", timestamp: "5 days"},
    { id: 63, src: reactLogo, username: "FollowedUser4", messageNumbers: 6, lastMessage: "Lorem ipsum dolor sit amet...", timestamp: "2 days"},
  ]

  const handleActive = (chat, index) => {
    setActiveChat(index)
    onSelect(chat.id)
  }

  return (
    <div>
      <SearchChat />
      <div>
        {active_chat.map((chat, index) => (
          <ActiveChat
            key={index}
            onClick={() => handleActive(chat, index)}
            isSelected={activeChat === index}
            {...chat}
          />
        ))}
      </div>
    </div>
  )
}

export default ActiveChatList