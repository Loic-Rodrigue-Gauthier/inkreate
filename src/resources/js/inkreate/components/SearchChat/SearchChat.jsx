import { useState, useRef } from 'react';
import styles from './SearchChat.module.css';

function SearchChat() {
  const [value, setValue] = useState('');
  const formRef = useRef(null);

  const updateValue = (e) => {
    setValue(e.target.value);
    formRef.current?.requestSubmit();
  };

  function submitForm(e) {
    e.preventDefault();
    // hook to filter chat list if needed
  }

  return (
    <div className={styles.wrapper}>
      <form onSubmit={submitForm} ref={formRef}>
        <input
          className={styles.input}
          type="text"
          name="name"
          value={value}
          onChange={updateValue}
          placeholder="Search chats..."
        />
      </form>
    </div>
  );
}

export default SearchChat;
