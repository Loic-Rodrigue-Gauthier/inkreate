import { useState, useMemo } from "react";
import styles from "./ActiveChatList.module.css";
import SearchChat from "../SearchChat/SearchChat.jsx";
import ActiveChat from "../ActiveChat/ActiveChat.jsx";
import avatarPlaceholder from "../../assets/avatar.svg";

function ActiveChatList({ onSelect, chatList }) {
  const [activeChat, setActiveChat] = useState(0);

  const handleActive = (chat, index) => {
    setActiveChat(index);
    onSelect(chat.id);
  };

  return (
    <div className={styles.list}>
      <SearchChat />
      <div style={{ display: "grid", gap: "8px" }}>
        {chatList.map(
          (chat, index) => (
            // const lastMessageObj = chat.messages?.[0];
            // const lastMessage =
            //   lastMessageObj?.body || lastMessageObj?.message || "";
            // const partner =
            //   chat.participants?.find((p) => p.id !== 1) ||
            //   chat.participants?.[0] ||
            //   null;
            // const displayName =
            //   chat.title || partner?.display_name || partner?.username || "Chat";
            // const avatar =
            //   ensureAbsoluteUrl(partner?.avatar_url) || avatarPlaceholder;
            // const timestamp =
            //   lastMessageObj?.created_at || chat.updated_at || chat.created_at;
            // return (
            <ActiveChat
              key={chat.id || index}
              onClick={() => handleActive(chat, index)}
              isSelected={activeChat === index}
              src={chat.avatar}
              username={chat.displayName}
              messageNumbers={chat.messages?.length ? "" : null}
              lastMessage={chat.lastMessage}
              timestamp={chat.timestamp}
              unread={chat.unread_count || 0}
            />
          ),
          // );
        )}
      </div>
    </div>
  );
}

export default ActiveChatList;
