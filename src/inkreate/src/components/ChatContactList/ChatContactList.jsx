import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import SearchContact from '../SearchContact/SearchContact'
import ChatContact from '../ChatContact/ChatContact'
import styles from './ChatContactList.module.css'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'
import pfp from '../../assets/pfp.svg'

function ChatContactList({ isOpen, onClose, onConfirm }) {
  const [selectedContacts, setSelectedContacts] = useState([])
  const contacts = [
    { src: viteLogo, username: "FollowedUser1", status: "Online"},
    { src: reactLogo, username: "FollowedUser2", status: "Offline"},
  ]

  useEffect(() => {
    if (!isOpen) setSelectedContacts([])
  }, [isOpen])

  if (!isOpen) return null

  const toggleContact = (contact) => {
    setSelectedContacts((prev) => {
      const exists = prev.find((c) => c.username === contact.username)
      return exists ? prev.filter((c) => c.username !== contact.username) : [...prev, contact]
    })
  }

  return createPortal(
    <div
      className={styles.bg}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className={styles.main}>
        <div className={styles.header}>
          <h2>Add users</h2>
          <button
            onClick={onClose}>
            ❌
          </button>
        </div>
        <div className={styles.search_contacts}>
          <SearchContact />
          <div className={styles.contacts}>
            {contacts.map((contact, index) => (
              <ChatContact
                key={index}
                onClick={() => toggleContact(contact)}
                isSelected={selectedContacts.find((c) => c.username === contact.username)}
                {...contact}
              />
            ))}
          </div>
          <button onClick={() => onConfirm(selectedContacts)}>Confirm selection</button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ChatContactList