
import { useState } from 'react'
import ActivityBoxList from '../../components/ActivityBoxList/ActivityBoxList'
import styles from './Activity.module.css'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'

function Activity() {
  const following = [
    {src: viteLogo, alt: 'image', username: "Username3", desc: "Lorem ipsum dolor sit amet.", updated: "3 hours"},
    {src: reactLogo, alt: 'image', username: "Username4", desc: "Lorem ipsum dolor sit amet.", updated: "6 hours"},
    {src: viteLogo, alt: 'image', username: "Username3", desc: "Lorem ipsum dolor sit amet.", updated: "9 hours"}
  ]
  const followers = [
    {src: reactLogo, alt: 'image', username: "Username1", desc: "Lorem ipsum dolor sit amet.", updated: "2 hours"},
    {src: viteLogo, alt: 'image', username: "Username2", desc: "Lorem ipsum dolor sit amet.", updated: "5 hours"},
    {src: reactLogo, alt: 'image', username: "Username1", desc: "Lorem ipsum dolor sit amet.", updated: "8 hours"}
  ]
  const [activeTab, setActiveTab] = useState('following')
  const [activity, setActivity] = useState(following)

  function displayFollowing() {
    setActiveTab('following')
    // DB code here

    setActivity(following)
  }

  function displayFollowers() {
    setActiveTab('followers')
    // DB code here

    setActivity(followers)
  }

  return (
    <>
      <nav>
          <button
            className={activeTab === 'following' ? styles.active : styles.tab}
            onClick={() => displayFollowing()}
          >
            Following
          </button>
          <button
            className={activeTab === 'followers' ? styles.active : styles.tab}
            onClick={() => displayFollowers()}
          >
            Followers
          </button>
      </nav>
      <ActivityBoxList activity={activity}/>
    </>
  )
}

export default Activity