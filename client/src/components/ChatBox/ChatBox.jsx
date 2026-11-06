import { useState } from "react";
import ChatBubble from "../ChatBubble/ChatBubble";
import ChatContact from "../ChatContact/ChatContact";
import styles from "./ChatBox.module.css";
import avatarPlaceholder from "../../assets/avatar.svg";
import { useI18n } from "../../context/I18nContext";

function ChatBox({ thread, messages = [], onSend }) {
  const [value, setValue] = useState("");
  const isDisabled = !thread;
  const { t } = useI18n();

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
            <strong>{t("chat.chatboxTitle")}</strong>
            <span style={{ color: "var(--muted)", fontSize: "13px" }}>
              {t("chat.chatboxDesc")}
            </span>
          </div>
        )}
      </div>
      <div className={styles.messages}>
        {!thread && (
          <div className={styles.empty}>{t("chat.chatboxEmpty")}</div>
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
                ? `${t("chat.chatboxPlaceholder")}`
                : `${t("chat.chatboxType")}`
            }
            disabled={isDisabled}
            className={isDisabled ? styles.disabled : ""}
          />
          <button
            className={`${styles.send} ${isDisabled ? styles.disabled : ""}`}
            type="submit"
            disabled={isDisabled}
          >
            {t("chat.send")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatBox;
