import { useState } from 'react'
import styles from './SearchBox.module.css'

function SearchBox() {
  const [inputs, setInputs] = useState({})

  const updateValue = (e) => {
    setInputs(values => ({...values, [e.target.name]: e.target.value}))
  }

  function submitForm(e) {
    e.preventDefault()
    // DB code here

  }

  return (
    <form onSubmit={submitForm}>
      <label>🔍
        <input
          type="text" 
          name="name" 
          value={inputs.name}
          onChange={updateValue}
        />
      </label>
      <div>
        <label>Order by:
          <select 
            name="order"
            value={inputs.order}
            onChange={updateValue}
          >
            <option value="Trending">Trending</option>
            <option value="AllAsc">All (Ascending)</option>
          </select>
        </label>
        <label>Genre:
          <select 
            name="genre"
            value={inputs.genre}
            onChange={updateValue}
          >
            <option value="Any">Any</option>
            <option value="Fantasy">Fantasy</option>
          </select>
        </label>
        <label>Status:
          <select 
            name="status"
            value={inputs.status}
            onChange={updateValue}
          >
            <option value="Any">Any</option>
            <option value="Ongoing">Ongoing</option>
          </select>
        </label>
        <label>Length (Segments):
          <select 
            name="length"
            value={inputs.length}
            onChange={updateValue}
          >
            <option value="Any">Any</option>
            <option value="Short">Short (1-50)</option>
          </select>
        </label>
      </div>
      <button type="submit">Search</button>
    </form>
  )
}

export default SearchBox