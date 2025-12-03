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
  const [isOpen, setIsOpen] = useState(false)
  const [activeList, setActiveList] = useState([
    { id: 72, src: viteLogo, username: "FollowedUser3", messageNumbers: 2, lastMessage: "Lorem ipsum dolor sit amet...", timestamp: "5 days"},
    { id: 63, src: reactLogo, username: "FollowedUser4", messageNumbers: 6, lastMessage: "Lorem ipsum dolor sit amet...", timestamp: "2 days"},
  ])
  const [activeId, setActiveId] = useState(activeList[0].id)
  const [chatUserList, setChatUserList] = useState([
    { id: 72, src: viteLogo, username: "FollowedUser3"},
    { id: 63, src: reactLogo, username: "FollowedUser4"},
  ])

  const handleConfirm = (selectedContacts) => {
    // DB with selectedContacts
    
    setIsOpen(false)
    let s, u, i
    if (selectedContacts.length > 1) {
      s = "group_chat.img"
      u = "Group Chat"
    }
    else {
      s = selectedContacts[0].src
      u = selectedContacts[0].username
    }
    i = Math.random()
    const newChat = { id: i, src: s, username: u, messageNumbers: null, lastMessage: "", timestamp: "0 sec."}
    const newUsers = { id: i, src: s, username: u}
    setActiveList(prev => [newChat, ...prev])
    setChatUserList(prev => [newUsers, ...prev])
    setActiveId(newChat.id)
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
        <ActiveChatList onSelect={setActiveId} chatList={activeList}/>
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
        <ChatBox chatId={activeId} userList={chatUserList}/>
      </section>
    </>
  )
}

export default Chat