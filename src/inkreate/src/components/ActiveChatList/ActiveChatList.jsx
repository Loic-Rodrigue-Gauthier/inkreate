import { useState } from 'react'
import styles from './ActiveChatList.module.css'
import SearchChat from '../SearchChat/SearchChat'
import ActiveChat from '../ActiveChat/ActiveChat'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'

function ActiveChatList({onSelect, chatList}) {
  const [activeChat, setActiveChat] = useState(0)

  const handleActive = (chat, index) => {
    setActiveChat(index)
    onSelect(chat.id)
  }

  return (
    <div>
      <SearchChat />
      <div>
        {chatList.map((chat, index) => (
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