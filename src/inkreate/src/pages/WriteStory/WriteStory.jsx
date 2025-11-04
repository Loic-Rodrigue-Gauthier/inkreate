import { useState } from 'react'
import styles from './WriteStory.module.css'

function WriteStory() {
  const [inputs, setInputs] = useState({})
  const [isFollowers, setIsFollowers] = useState(true)

  const updateValue = (e) => {
    setInputs(values => ({...values, [e.target.name]: e.target.value}))
  }

  return (
    <>
      <section>
        <h2>New Story</h2>
        <label>Title
          <input
            type="text" 
            name="title" 
            value={inputs.title}
            onChange={updateValue}
          />
        </label>
        <label>Genre(s):
          <select 
            name="genre"
            value={inputs.genre}
            onChange={updateValue}
          >
            <option value="Fantasy">Fantasy</option>
            <option value="Action">Action</option>
          </select>
        </label>
        <div>
          {/* "genre" Comps TO-DO.map */}
        </div>
        {/* img + desc Comp TO-DO*/}
        <label>Who can create segments?:
          <select 
            name="visibility"
            value={inputs.visibility}
            onChange={updateValue}
          >
            <option value="Only Me">Only Me</option>
            <option value="Followers">Followers</option>
            <option value="Anyone">Anyone</option>
          </select>
        </label>
        {isFollowers &&
          <div>
            Contributors:
            {/* added followers list + button to open ChatContactList */}
            <button>Add contributors</button>
          </div>
        }
      </section>
      <section>
        {/* new segment Comp (which includes img + desc Comp & "choice" Comps) TO-DO*/}
      </section>
      <button>Publish Story</button>
    </>
  )
}

export default WriteStory