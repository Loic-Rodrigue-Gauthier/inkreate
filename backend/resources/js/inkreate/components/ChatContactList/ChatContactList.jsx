import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import SearchContact from '../SearchContact/SearchContact';
import ChatContact from '../ChatContact/ChatContact';
import styles from './ChatContactList.module.css';
import { api } from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext.jsx';
import avatarPlaceholder from '../../assets/avatar.svg';

function ChatContactList({ isOpen, onClose, onConfirm }) {
  const { token } = useAuth();
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setSelectedContacts([]);
      return;
    }
    api.users(token, query)
      .then((res) => {
        setContacts(res.data ?? res);
      })
      .catch(() => setContacts([]));
  }, [isOpen, query, token]);

  if (!isOpen) return null;

  const toggleContact = (contact) => {
    setSelectedContacts((prev) => {
      const exists = prev.find((c) => c.username === contact.username);
      return exists ? prev.filter((c) => c.username !== contact.username) : [...prev, contact];
    });
  };

  return createPortal(
    <div className={styles.modal}>
      <div className={styles.panel}>
        <div style={{ marginBottom: '8px' }}>
          <input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.search}
          />
        </div>
        <div className={styles.list}>
          {contacts.map((contact) => (
            <ChatContact
              key={contact.id}
              src={contact.avatar_url || avatarPlaceholder}
              username={contact.display_name || contact.username}
              onClick={() => toggleContact(contact)}
              isSelected={!!selectedContacts.find((c) => c.username === contact.username)}
            />
          ))}
        </div>
        <div className={styles.actions}>
          <button className="btn primary" onClick={() => onConfirm(selectedContacts)}>Confirm</button>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default ChatContactList;
