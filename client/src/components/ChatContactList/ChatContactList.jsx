import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import SearchContact from "../SearchContact/SearchContact.jsx";
import ChatContact from "../ChatContact/ChatContact.jsx";
import styles from "./ChatContactList.module.css";
import avatarPlaceholder from "../../assets/avatar.svg";
import { useI18n } from "../../context/I18nContext.jsx";

function ChatContactList({ isOpen, onClose, onConfirm }) {
  const { t } = useI18n();

  const [selectedContacts, setSelectedContacts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setSelectedContacts([]);
      return;
    }
    if (!1) {
      setContacts([]);
      return;
    }
  }, [isOpen, 1]);

  const filteredContacts = contacts.filter((c) => {
    if (!query.trim()) return true;
    const term = query.toLowerCase();
    return (
      c.username?.toLowerCase().includes(term) ||
      c.display_name?.toLowerCase().includes(term)
    );
  });

  if (!isOpen) return null;

  const toggleContact = (contact) => {
    setSelectedContacts((prev) => {
      const exists = prev.find((c) => c.username === contact.username);
      return exists
        ? prev.filter((c) => c.username !== contact.username)
        : [...prev, contact];
    });
  };

  return createPortal(
    <div className={styles.modal}>
      <div className={styles.panel}>
        <div style={{ marginBottom: "8px" }}>
          <input
            type="text"
            placeholder={t("common.addUsersPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.search}
          />
        </div>
        <div className={styles.list}>
          {filteredContacts.map((contact) => (
            <ChatContact
              key={contact.id}
              src={contact.avatar_url || avatarPlaceholder}
              username={contact.display_name || contact.username}
              onClick={() => toggleContact(contact)}
              isSelected={
                !!selectedContacts.find((c) => c.username === contact.username)
              }
            />
          ))}
        </div>
        <div className={styles.actions}>
          <button className="btn primary">{t("common.confirm")}</button>
          <button className="btn ghost" onClick={onClose}>
            {t("common.cancel")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default ChatContactList;
