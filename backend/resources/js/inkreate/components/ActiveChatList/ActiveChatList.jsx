import { useState } from 'react';
import styles from './ActiveChatList.module.css';
import SearchChat from '../SearchChat/SearchChat';
import ActiveChat from '../ActiveChat/ActiveChat';
import avatarPlaceholder from '../../assets/avatar.svg';

function ActiveChatList({ onSelect, chatList }) {
  const [activeChat, setActiveChat] = useState(0);

  const handleActive = (chat, index) => {
    setActiveChat(index);
    onSelect(chat.id);
  };

  return (
    <div>
      <SearchChat />
      <div>
        {chatList.map((chat, index) => {
          const lastMessage = chat.messages?.[0]?.body || chat.messages?.[0]?.message || '';
          return (
            <ActiveChat
              key={chat.id || index}
              onClick={() => handleActive(chat, index)}
              isSelected={activeChat === index}
              src={chat.creator?.avatar_url || avatarPlaceholder}
              username={chat.title || chat.creator?.display_name || 'Chat'}
              messageNumbers={chat.messages?.length ? '' : null}
              lastMessage={lastMessage}
              timestamp={chat.created_at}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ActiveChatList;
