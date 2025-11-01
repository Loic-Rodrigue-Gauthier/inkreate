import { useState, useRef } from 'react'
import styles from './SearchChat.module.css'

function SearchChat() {
  const [value, setValue] = useState()
  const formRef = useRef(null)

  const updateValue = (e) => {
    const value = e.target.value
    setValue(value)
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
        <label>🔍
          <input
            type="text" 
            name="name" 
            value={value}
            onChange={updateValue}
          />
        </label>
      </form>
    </div>
  )
}

export default SearchChat