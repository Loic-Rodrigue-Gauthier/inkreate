import { useState } from "react";
import ChatBubble from "../ChatBubble/ChatBubble";
import ChatContact from "../ChatContact/ChatContact";
import styles from "./ChatBox.module.css";
import avatarPlaceholder from "../../assets/avatar.svg";

function ChatBox({ thread, messages = [], onSend }) {
  const [value, setValue] = useState("");
  const isDisabled = !thread;

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (!value.trim() || isDisabled) return;
    // onSend(value);
    // setValue("");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        {thread ? (
          <>
            <ChatContact
              src={avatarPlaceholder}
              username={thread.title || "Conversation"}
            />
            <div className={styles.threadInfo}>
              {/* <strong>{thread.title || "Chat"}</strong> */}
              <span style={{ color: "var(--muted)", fontSize: "13px" }}>
                {thread.participants?.length || 0} participants
              </span>
            </div>
          </>
        ) : (
          <div className={styles.threadInfo}>
            <strong>Select or start a chat</strong>
            <span style={{ color: "var(--muted)", fontSize: "13px" }}>
              Use “New Chat” to begin
            </span>
          </div>
        )}
      </div>
      <div className={styles.messages}>
        {!thread && (
          <div className={styles.empty}>No conversation selected.</div>
        )}
        {thread && messages.length === 0 && (
          <div className={styles.empty}>No messages yet.</div>
        )}
        {thread &&
          messages.map((message, index) => (
            <ChatBubble
              key={index}
              src={message.author?.avatar_url || avatarPlaceholder}
              username={message.username}
              message={message.body}
              timestamp={new Date(
                message.created_at || Date.now(),
              ).toLocaleTimeString()}
            />
          ))}
      </div>
      <div className={styles.inputRow}>
        <form onSubmit={handleSubmit}>
          <textarea
            name="message"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={
              isDisabled
                ? "Select or start a conversation to type..."
                : "Type a message..."
            }
            disabled={isDisabled}
            className={isDisabled ? styles.disabled : ""}
          />
          <button
            className={`${styles.send} ${isDisabled ? styles.disabled : ""}`}
            type="submit"
            disabled={isDisabled}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatBox;
