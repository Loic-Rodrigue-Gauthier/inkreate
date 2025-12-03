import { useEffect, useState } from 'react';
import ChatContactList from '../../components/ChatContactList/ChatContactList';
import ActiveChatList from '../../components/ActiveChatList/ActiveChatList';
import ChatContact from '../../components/ChatContact/ChatContact';
import ChatBox from '../../components/ChatBox/ChatBox';
import styles from './Chat.module.css';
import { useAuth } from '../../context/AuthContext.jsx';
import { api, resourceData } from '../../services/apiClient.js';

function Chat() {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [online] = useState([
    { src: null, username: 'wordsmith_alex' },
    { src: null, username: 'fantasy_circle' },
  ]);

  useEffect(() => {
    if (!token) return;
    setIsLoading(true);
    api.chatThreads(token)
      .then((res) => {
        const items = resourceData(res);
        setThreads(items);
        if (items?.[0]) {
          setSelectedThread(items[0]);
          fetchThread(items[0].id, items);
        }
      })
      .catch(() => {
        setThreads([]);
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  useEffect(() => {
    if (!token || !selectedThread) return;
    const interval = setInterval(() => {
      fetchThread(selectedThread.id);
      api.chatThreads(token).then((res) => setThreads(resourceData(res))).catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [token, selectedThread]);

  const fetchThread = (id, currentThreads = threads) => {
    api.chatThread(token, id)
      .then((res) => {
        const thread = resourceData(res) || res;
        setSelectedThread(thread);
        setMessages(resourceData(thread.messages ?? thread.data?.messages ?? []));
      })
      .catch(() => {
        const fallback = currentThreads.find((t) => t.id === id);
        if (fallback) {
          setSelectedThread(fallback);
          setMessages([]);
        }
      });
  };

  const handleSelect = (id) => {
    fetchThread(id);
  };

  const handleSend = async (body) => {
    if (!selectedThread || !body?.trim()) return;

    const optimistic = {
      id: Date.now(),
      author: { display_name: 'You' },
      body,
      created_at: new Date().toISOString(),
      optimistic: true,
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const sent = await api.sendMessage(token, selectedThread.id, { body });
      const msg = resourceData(sent) || sent;
      setMessages((prev) => {
        // replace optimistic if it exists, otherwise append
        const withoutOptimistic = prev.filter((m) => !m.optimistic);
        return [...withoutOptimistic, msg];
      });
    } catch (_e) {
      // keep optimistic message; you could surface a toast here if needed
    }
  };

  const handleConfirm = async (contacts) => {
    setIsOpen(false);
    if (!contacts.length) return;
    const participant_ids = contacts.map((c) => c.id);
    const payload = {
      type: participant_ids.length > 1 ? 'group' : 'direct',
      participant_ids,
      title: participant_ids.length > 1 ? 'Group Chat' : undefined,
    };
    let thread;
    try {
      const created = await api.createThread(token, payload);
      thread = resourceData(created);
    } catch (e) {
      thread = null;
    }

    if (!thread?.id) {
      thread = {
        id: Date.now().toString(),
        title: payload.title || contacts[0]?.display_name || contacts[0]?.username || 'New Chat',
        participants: contacts,
        messages: [],
      };
    }

    setThreads((prev) => [thread, ...prev]);
    setSelectedThread(thread);
    setMessages([]);
    fetchThread(thread.id, [thread, ...threads]);
  };

  return (
    <div className={styles.page}>
      <section className={styles.sidebar}>
        <button className={styles.newChat} onClick={() => setIsOpen(true)}>
          + New Chat
        </button>
        <ChatContactList isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={handleConfirm} />
        <div className={styles.threadList}>
          {isLoading && <div className={styles.empty}>Loading threads...</div>}
          {!isLoading && !threads.length && <div className={styles.empty}>No conversations yet.</div>}
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
        <ChatBox thread={selectedThread} messages={messages} onSend={handleSend} />
      </section>
    </div>
  );
}

export default Chat;
