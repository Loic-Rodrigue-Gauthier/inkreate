import { useEffect, useState } from "react";
import ChatContactList from "../../components/ChatContactList/ChatContactList.jsx";
import ActiveChatList from "../../components/ActiveChatList/ActiveChatList.jsx";
import ChatContact from "../../components/ChatContact/ChatContact.jsx";
import ChatBox from "../../components/ChatBox/ChatBox.jsx";
import styles from "./Chat.module.css";
import { useMemo } from "react";
import { useI18n } from "../../context/I18nContext.jsx";

function Chat() {
  const { t } = useI18n();

  const [isOpen, setIsOpen] = useState(false);
  const [threads, setThreads] = useState([
    {
      id: 1,
      avatar: "",
      displayName: "Mysterious-Alex",
      messages: [
        "Lorem ipsum dolor sit amet.",
        "Lorem ipsum dolor sit amet.",
        "Lorem ipsum dolor sit amet.",
      ],
      lastMessage: "Lorem ipsum dolor sit amet.",
      timestamp: "Today",
      unread_count: 1,
    },
  ]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([
    {
      author: "",
      username: "Mysterious-Alex",
      body: "Lorem ipsum dolor sit amet.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatError, setChatError] = useState(null);
  const [online] = useState([
    { src: null, username: "Mysterious-Alex" },
    { src: null, username: "Fantastic-Anna" },
    { src: null, username: "Romantic-Amelia" },
  ]);

  const unreadTotal = useMemo(
    () => threads.reduce((sum, t) => sum + (t.unread_count || 0), 0),
    [threads],
  );

  const handleSelect = () => {
    setSelectedThread({
      title: "Mysterious-Alex",
      participants: ["Mysterious-Alex", "User"],
    });
  };

  // const addMessage = (value) => {
  //   setMessages((prev) => {
  //     [
  //       ...prev,
  //       {
  //         author: "",
  //         username: "User",
  //         body: value,
  //       },
  //     ];
  //   });
  // };

  return (
    <div className={styles.shell}>
      <div className={styles.hero}>
        <div>
          <p className={styles.kicker}>Messages</p>
          <h1 className={styles.title}>Chat</h1>
          <p className={styles.subtitle}>
            Stay in sync with collaborators and friends.
          </p>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{threads.length}</span>
            <span className={styles.statLabel}>Threads</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{unreadTotal}</span>
            <span className={styles.statLabel}>Unread</span>
          </div>
        </div>
      </div>

      <div className={styles.page}>
        <section className={styles.sidebar}>
          <button className={styles.newChat} onClick={() => setIsOpen(true)}>
            + New Chat
          </button>
          <ChatContactList isOpen={isOpen} onClose={() => setIsOpen(false)} />
          {chatError && (
            <div className={styles.empty} style={{ color: "red" }}>
              {chatError}
            </div>
          )}
          <div className={styles.sectionHeader}>Conversations</div>
          <div className={styles.threadList}>
            {isLoading && (
              <div className={styles.empty}>Loading threads...</div>
            )}
            {!isLoading && !threads.length && (
              <div className={styles.empty}>No conversations yet.</div>
            )}
            {!isLoading && threads.length > 0 && (
              <ActiveChatList onSelect={handleSelect} chatList={threads} />
            )}
          </div>
          <div className={styles.online}>
            <h4>Online Friends</h4>
            <div>
              {online.map((onlineUser, index) => (
                <ChatContact key={index} {...onlineUser} />
              ))}
            </div>
          </div>
        </section>
        <section className={styles.main}>
          <ChatBox
            thread={selectedThread}
            messages={messages}
            // onSend={addMessage}
          />
        </section>
      </div>
    </div>
  );
}

export default Chat;
