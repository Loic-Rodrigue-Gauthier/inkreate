import { useState } from 'react'
import SegmentImageText from '../../components/SegmentImageText/SegmentImageText'
import styles from './WriteStory.module.css'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'
import DiscardableChip from '../../components/DiscardableChip/DiscardableChip'
import ChatContactList from '../../components/ChatContactList/ChatContactList'
import NewSegment from '../../components/NewSegment/NewSegment'

function WriteStory() {
  const [inputs, setInputs] = useState({visibility: "Anyone"})
  const [selected, setSelected] = useState({genre: ""})
  const [isFollowers, setIsFollowers] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [thumbnail, setThumbnail] = useState(reactLogo)
  const [tagList, setTagList] = useState([])
  const [userList, setUserList] = useState([])

  const updateValue = (e) => {
    setInputs(values => ({...values, [e.target.name]: e.target.value}))
    if (e.target.name === "visibility") setIsFollowers(e.target.value === "Followers")
  }

  const updateSelected = (e) => {
    setSelected(values => ({...values, [e.target.name]: e.target.value}))

    if (e.target.name === "genre") {
      const newTag = { text: e.target.value }
      setTagList(prev => {
        const exists = prev.some(tag => tag.text === newTag.text)
        return exists ? prev : [...prev, newTag]
      })
      setSelected(prev => ({...prev, genre: ""}))
    }
  }

  const updateThumbnail = () => {
    // Windows Open file prompt...

    setThumbnail(viteLogo)
  }

  const removeTag = (text) => {
    setTagList(prev => prev.filter((tag) => tag.text != text))
  }

  const removeUser = (username) => {
    setUserList(prev => prev.filter((user) => user.username != username))
  }

  const addUsers = (selectedContacts) => {
    setUserList(prev => {
      const updatedList = selectedContacts.filter((contact) =>
        !prev.some(user => user.username === contact.username
      ))
      return [...prev, ...updatedList]
    })
    setIsOpen(false)
  }

  const createStory = () => {
    // DB code here...

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
            value={selected.genre}
            onChange={updateSelected}
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
              removeChip={removeTag}
            />
          ))}
        </div>
        <SegmentImageText
          src={thumbnail}
          img_title="Thumbnail"
          txt_title="Synopsis"
          name="synopsis"
          inputs={inputs}
          updateValue={updateValue}
          updateImage={updateThumbnail}
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
            <ChatContactList
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              onConfirm={addUsers}
            />
            <button onClick={() => setIsOpen(true)}>Add contributors</button>
            <div>
              {userList
              .map((user, index) => (
                <DiscardableChip
                  key={index}
                  src={user.src}
                  text={user.username}
                  removeChip={removeUser}
                />
              ))}
            </div>
          </div>
        }
      </section>
      <section>
        <NewSegment
          isPortal={false}
          isFirst={true}

          // data to export here!
          
        />
      </section>
      <button onClick={createStory}>Publish Story</button>
    </>
  )
}

export default WriteStory