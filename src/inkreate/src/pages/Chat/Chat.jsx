import { useState } from 'react'
import ChatContactList from '../../components/ChatContactList/ChatContactList'
import ActiveChatList from '../../components/ActiveChatList/ActiveChatList'
import ChatContact from '../../components/ChatContact/ChatContact'
import ChatBox from '../../components/ChatBox/ChatBox'
import styles from './Chat.module.css'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'

function Chat() {
  const online = [
    { src: viteLogo, username: "FollowedUser5"},
    { src: reactLogo, username: "FollowedUser6"},
  ]
  const user_chat = [ //temp
    { id: 72, src: viteLogo, username: "FollowedUser3"},
    { id: 63, src: reactLogo, username: "FollowedUser4"},
  ]
  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState(user_chat[0].id)

  const handleConfirm = (selectedContacts) => {
    // DB with selectedContacts
    setIsOpen(false)

  }

  return (
    <>
      <section>
        <button onClick={() => setIsOpen(true)}>New Chat</button>
        <ChatContactList
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={handleConfirm}
        />
        <ActiveChatList onSelect={setActiveId}/>
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
      </section>
      <section>
        <ChatBox chatId={activeId}/>
      </section>
    </>
  )
}

export default Chat