
import styles from './ActiveChatList.module.css'
import SearchChat from '../SearchChat/SearchChat'
import ActiveChat from '../ActiveChat/ActiveChat'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'

function ActiveChatList() {
  const active_chat = [
    { src: viteLogo, username: "FollowedUser3", messageNumbers: 2, lastMessage: "Lorem ipsum dolor sit amet...", timestamp: "5 days"},
    { src: reactLogo, username: "FollowedUser4", messageNumbers: 6, lastMessage: "Lorem ipsum dolor sit amet...", timestamp: "2 days"},
  ]

  return (
    <div>
      <SearchChat />
      <div>
        {active_chat.map((chat, index) => (
          <ActiveChat
            key={index}
            // onClick={() => </>}
            {...chat}
          />
        ))}
      </div>
    </div>
  )
}

export default ActiveChatList