import { useState } from 'react'
import SearchChat from '../SearchChat/SearchChat'
import ActiveChat from '../ActiveChat/ActiveChat'
import styles from './ActiveChatList.module.css'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'

function ActiveChatList({onSelect, chatList}) {
  const [activeChat, setActiveChat] = useState(0)

  const handleActive = (chat, index) => {
    setActiveChat(index)
    onSelect(chat.id)
  }

  return (
    <div className={styles.main}>
      <SearchChat />
      <div className={styles.list}>
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