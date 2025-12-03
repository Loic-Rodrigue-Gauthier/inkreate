import { useState, useRef } from 'react'
import styles from './CheckboxOption.module.css'

function CheckboxOption({src, alt='image', title, desc, option}) {
  const [isChecked, setIsChecked] = useState(false)
  const formRef = useRef(null)

  const updateValue = (e) => {
    const checked = e.target.checked
    setIsChecked(checked)
    formRef.current.requestSubmit()
  }

  function submitForm(e) {
    e.preventDefault()
    // DB code here

  }

  return (
    <div>
      <div><img src={src} alt={alt} /></div>
      <div>
        <div>{title}</div>
        <div>{desc}</div>
      </div>
      <form
        onSubmit={submitForm}
        ref={formRef}
      >
        <input 
          type="checkbox" 
          name={option}
          checked={isChecked} 
          onChange={updateValue}
        />
      </form>
    </div>
  )
}

export default CheckboxOption