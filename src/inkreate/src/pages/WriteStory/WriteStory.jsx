import { useState } from 'react'
import { LinkedList } from '../../utils/LinkedList'
import SegmentImageText from '../../components/SegmentImageText/SegmentImageText'
import DiscardableChip from '../../components/DiscardableChip/DiscardableChip'
import ChatContactList from '../../components/ChatContactList/ChatContactList'
import NewSegment from '../../components/NewSegment/NewSegment'
import styles from './WriteStory.module.css'
import bliss from '../../assets/bliss.jpg'

function WriteStory() {
  const [inputs, setInputs] = useState({visibility: "Anyone"})
  const [selected, setSelected] = useState({genre: ""})
  const [isFollowing, setIsFollowing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [thumbnail, setThumbnail] = useState()
  const [tagList, setTagList] = useState(() => new LinkedList())
  const [userList, setUserList] = useState(() => new LinkedList())
  const [segData, setSegData] = useState({})

  const updateValue = (e) => {
    setInputs(values => ({...values, [e.target.name]: e.target.value}))
    if (e.target.name === "visibility") setIsFollowing(e.target.value === "Following")
  }

  const updateSelected = (e) => {
    setSelected((values) => ({...values, [e.target.name]: e.target.value, })) 

    if (e.target.name === "genre") {
      const newTag = { text: e.target.value } 

      setTagList((prev) => {
        const list = prev.clone() 
        const exists = list.toArray().some((tag) => tag.text === newTag.text) 

        if (!exists) {
          list.addLast(newTag)
        }

        return list 
      }) 

      setSelected((prev) => ({ ...prev, genre: "" })) 
    }
  }

  const updateThumbnail = () => {
    // Windows Open file prompt...

    setThumbnail(bliss)
  }

  const removeTag = (text) => {
    setTagList(prev => {
      const list = prev.clone()
      list.removeByValue('text', text)
      return list
    })
  }

  const removeUser = (username) => {
    setUserList(prev => {
      const list = prev.clone()
      list.removeByValue('username', username)
      return list
    })
  }

  const addUsers = (selectedContacts) => {
    setUserList(prev => {
      const list = prev.clone()

      selectedContacts.forEach(contact => {
        const exists = list
          .toArray()
          .some(user => user.username === contact.username)

        if (!exists) {
          list.addLast(contact)
        }
      })

      return list
    })

    setIsOpen(false)
  }

  const createStory = () => {
    // DB code here...

  }

  return (
    <div className={styles.main}>
      <section className={styles.story}>
        <h2>New Story</h2>
        <div>
          <label>Title:</label>
          <input
            type="text" 
            name="title" 
            value={inputs.title}
            onChange={updateValue}
          />
        </div>
        <div>
          <label>Genre(s):</label>
          <select 
            name="genre"
            value={selected.genre}
            onChange={updateSelected}
          >
            <option value="" disabled hidden>Select a genre...</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Action">Action</option>
          </select>
        </div>
        <div className={styles.chips}>
          {tagList.toArray().map(tag => (
            <DiscardableChip
              key={tag.text}
              text={tag.text}
              removeChip={() => removeTag(tag.text)}
            />
          ))}
        </div>
        <div>
          <SegmentImageText
            src={thumbnail}
            img_title="Thumbnail"
            txt_title="Synopsis"
            name="synopsis"
            inputs={inputs}
            updateValue={updateValue}
            updateImage={updateThumbnail}
          />
        </div>
        <div className={styles.sharing}>
          <div>
            <label>Who can create segments?</label>
            <select 
              name="visibility"
              value={inputs.visibility}
              onChange={updateValue}
            >
              <option value="Only Me">Only Me</option>
              <option value="Following">Following</option>
              <option value="Anyone">Anyone</option>
            </select>
          </div>
          {isFollowing &&
            <div>
              <div className={styles.following}>
                <label>Contributors:</label>
                <ChatContactList
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                  onConfirm={addUsers}
                />
                <button onClick={() => setIsOpen(true)}>Add contributors</button>
              </div>
              <div className={styles.chips}>
                {userList.toArray().map(user => (
                  <DiscardableChip
                    key={user.username}
                    src={user.src}
                    text={user.username}
                    removeChip={removeUser}
                  />
                ))}
              </div>
            </div>
          }
        </div>
      </section>
      <section>
        <NewSegment
          isPortal={false}
          isFirst={true}
          segData={segData}
          setSegData={setSegData}
        />
      </section>
      <div className={styles.publish}>
        <button onClick={createStory}>Publish Story</button>
      </div>
    </div>
  )
}

export default WriteStory