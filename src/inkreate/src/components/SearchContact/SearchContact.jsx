import { useState, useRef } from 'react'
import styles from './SearchContact.module.css'

function SearchContact() {
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

export default SearchContact