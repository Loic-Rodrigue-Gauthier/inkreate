import { useState } from 'react'
import UserStats from '../../components/UserStats/UserStats'
import StoryThumbnailList from '../../components/StoryThumbnailList/StoryThumbnailList'
import ActivityBoxList from '../../components/ActivityBoxList/ActivityBoxList'
import ContributionList from '../../components/ContributionList/ContributionList'
import styles from './Profile.module.css'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'
import ChatContact from '../../components/ChatContact/ChatContact'

function Profile() {
  const [activeTab, setActiveTab] = useState('contributions')
  // temp_test
  const aut_list = [reactLogo, viteLogo]
  const tag_list = ["tag1", "tag2", "tag3"]
  const stories = [
    { src: viteLogo, alt:'image', title:"Lorem ipsum dolor sit amet.", desc:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt, laudantium.",
      tags: tag_list, authors: aut_list, segments:"23", views:"1250",
      comments:"89", rating:"4.8", updated:"2 hours" },
    { src: viteLogo, alt:'image', title:"Lorem ipsum dolor sit amet.", desc:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt, laudantium.",
      tags: tag_list, authors: aut_list, segments:"23", views:"1250",
      comments:"89", rating:"4.8", updated:"2 hours" },
    { src: viteLogo, alt:'image', title:"Lorem ipsum dolor sit amet.", desc:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt, laudantium.",
      tags: tag_list, authors: aut_list, segments:"23", views:"1250",
      comments:"89", rating:"4.8", updated:"2 hours" },
  ]
  const activity = [
    {src: reactLogo, alt: 'image', username: "loggedin_Username", desc: "Lorem ipsum dolor sit amet.", updated: "2 hours"},
    {src: reactLogo, alt: 'image', username: "loggedin_Username", desc: "Lorem ipsum dolor sit amet.", updated: "5 hours"},
    {src: reactLogo, alt: 'image', username: "loggedin_Username", desc: "Lorem ipsum dolor sit amet.", updated: "8 hours"}
  ]
  const contributions = [
    {title: "Story 9", segment: "54", choice: "Choice 321", paragraph: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure, optio..."},
    {title: "Story 666", segment: "2", choice: "Choice 48", paragraph: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure, optio..."},
    {title: "Story 12", segment: "956", choice: "Choice 6", paragraph: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure, optio..."},
  ]
  const following = [
    { src: viteLogo, username: "Username3"},
    { src: reactLogo, username: "Username4"},
  ]
  const followers = [
    { src: reactLogo, username: "Username1"},
    { src: viteLogo, username: "Username2"},
  ]
  //

  const [activeSubTab, setActiveSubTab] = useState('following')
  const [relations, setRelations] = useState(following)

  function displayFollowing() {
    setActiveSubTab('following')
    // DB code here

    setRelations(following)
  }

  function displayFollowers() {
    setActiveSubTab('followers')
    // DB code here

    setRelations(followers)
  }

  return (
    <>
      <section>
        <img src={reactLogo} alt="" />
        <div>Joined XX 20XX</div>
        <h1>Username</h1>
        <div>Bio</div>
        <UserStats src={viteLogo} alt='image' number="23" desc="Lorem" />
        <UserStats src={viteLogo} alt='image' number="156" desc="Lorem" />
        <UserStats src={viteLogo} alt='image' number="89" desc="Lorem" />
        <UserStats src={viteLogo} alt='image' number="4.6" desc="Lorem" />
      </section>
      <nav>
          <button
            className={activeTab === 'contributions' ? styles.active : styles.tab}
            onClick={() => setActiveTab('contributions')}
          >
            <img src={reactLogo} alt="contributions" />
            Contributions
          </button>
          <button
            className={activeTab === 'favs' ? styles.active : styles.tab}
            onClick={() => setActiveTab('favs')}
          >
            <img src={viteLogo} alt="favs" />
            Favorites
          </button>
          <button
            className={activeTab === 'activity' ? styles.active : styles.tab}
            onClick={() => setActiveTab('activity')}
          >
            <img src={reactLogo} alt="activity" />
            Activity
          </button>
          <button
            className={activeTab === 'relations' ? styles.active : styles.tab}
            onClick={() => setActiveTab('relations')}
          >
            <img src={viteLogo} alt="relations" />
            Relations
          </button>
      </nav>
      <div>
        {activeTab === 'contributions' && <ContributionList contributions={contributions} />}
        {activeTab === 'favs' && <StoryThumbnailList stories={stories} />}
        {activeTab === 'activity' && <ActivityBoxList activity={activity}/>}
        {activeTab === 'relations' &&
          <div>
            <nav>
                <button
                  className={activeSubTab === 'following' ? styles.active : styles.tab}
                  onClick={() => displayFollowing()}
                >
                  Following
                </button>
                <button
                  className={activeSubTab === 'followers' ? styles.active : styles.tab}
                  onClick={() => displayFollowers()}
                >
                  Followers
                </button>
            </nav>
            {relations.map((rel, index) => (
              <ChatContact
                key={index}
                {...rel}
              />
            ))}
          </div>
        }
      </div>
    </>
  )
}

export default Profile