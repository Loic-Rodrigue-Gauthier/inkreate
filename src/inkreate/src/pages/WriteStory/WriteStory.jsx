import { useState } from 'react'
import SegmentImageText from '../../components/SegmentImageText/SegmentImageText'
import styles from './WriteStory.module.css'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'
import DiscardableChip from '../../components/DiscardableChip/DiscardableChip'

function WriteStory() {
  const [inputs, setInputs] = useState({genre: "", visibility: "Anyone"})
  const [isFollowers, setIsFollowers] = useState(false)
  const [thumbnail, setThumbnail] = useState(reactLogo)
  const [tagList, setTagList] = useState([])
  const [userList, setUserList] = useState([])
  const [choiceList, setChoiceList] = useState([])

  const updateValue = (e) => {
    setInputs(values => ({...values, [e.target.name]: e.target.value}))
    if (e.target.name === "visibility") setIsFollowers(e.target.value === "Followers")

    if (e.target.name === "genre") {
      const newTag = { text: e.target.value }
      setTagList(prev => [...prev, newTag])
      setInputs(prev => ({...prev, genre: ""}))
    }
  }

  const updateImage = () => {
    // Windows Open file prompt...

    setThumbnail(viteLogo)
  }

  const removeChip = (text) => {
    setTagList(prev => prev.filter((tag) => tag.text != text))
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
            <option value="" disabled hidden>Select a genre...</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Action">Action</option>
          </select>
        </label>
        <div>
          {tagList
          .map((tag, index) => (
            <DiscardableChip
              key={index}
              text={tag.text}
              removeChip={removeChip}
            />
          ))}
        </div>
        <SegmentImageText
          src={thumbnail}
          img_title="Thumbnail"
          txt_title="Synopsis"
          inputs={inputs}
          updateValue={updateValue}
          updateImage={updateImage}
        />
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
        {/* new segment Comp (which includes SegmentImageText & DiscardableChip) TO-DO*/}
      </section>
      <button>Publish Story</button>
    </>
  )
}

export default WriteStory