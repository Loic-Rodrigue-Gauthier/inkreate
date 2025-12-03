import { useState, useRef } from 'react'
import styles from './SearchChat.module.css'

function SearchChat() {
  const [value, setValue] = useState()
  const formRef = useRef(null)

  const updateValue = (e) => {
    setValue(e.target.value)
    formRef.current.requestSubmit()
  }

  function submitForm(e) {
    e.preventDefault()
    // DB code here

  }

  return (
    <div>
      <form
        onSubmit={submitForm}
        ref={formRef}
      >
        <div className={styles.search}>
          <label>🔍</label>
          <input
            placeholder='Search conversations...'
            type="text" 
            name="name" 
            value={value}
            onChange={updateValue}
          />
        </div>
      </form>
    </div>
  )
}

export default SearchChat