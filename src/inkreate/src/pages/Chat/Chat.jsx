import { useState } from 'react'
import SearchChat from '../../components/SearchChat/SearchChat'
import ChatContactList from '../../components/ChatContactList/ChatContactList'
import ActiveChatList from '../../components/ActiveChatList/ActiveChatList'
import ChatContact from '../../components/ChatContact/ChatContact'
import styles from './Chat.module.css'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'

function Chat() {
  const [isOpen, setIsOpen] = useState(false)
  const online = [
    { src: viteLogo, username: "FollowedUser5"},
    { src: reactLogo, username: "FollowedUser6"},
  ]

  const handleConfirm = (selectedContacts) => {
    // DB with selectedContacts
    setIsOpen(false)

  }

  return (
    <>
      <button onClick={() => setIsOpen(true)}>New Chat</button>
      <ChatContactList
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
      />
      <ActiveChatList />
      <div>
        <h3>Online followers</h3>
        <div>
          {online.map((online, index) => (
            <ChatContact
              key={index}
              // onClick={() => </>}
              {...online}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default Chat