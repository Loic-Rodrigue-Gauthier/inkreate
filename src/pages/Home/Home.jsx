
import UserStats from '../../components/UserStats/UserStats'
import StoryThumbnail from '../../components/StoryThumbnail/StoryThumbnail'
import ActivityBox from '../../components/ActivityBox/ActivityBox'
import styles from './Home.module.css'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'

function Home() {
  // temp_test
  const aut_list = [reactLogo, viteLogo]
  const tag_list = ["tag1", "tag2", "tag3"]
  //

  return (
    <>
      <h1>Lorem ipsum dolor sit amet.</h1>
      <section>
        <UserStats src={reactLogo} alt='image' number="23" desc="Lorem" />
        <UserStats src={reactLogo} alt='image' number="156" desc="Lorem" />
        <UserStats src={reactLogo} alt='image' number="89" desc="Lorem" />
        <UserStats src={reactLogo} alt='image' number="4.6" desc="Lorem" />
      </section>
      <h2>Section 1</h2>
      <section>
        <StoryThumbnail
          src={viteLogo} alt='image' title="Lorem ipsum dolor sit amet." desc="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt, laudantium."
          tags={tag_list} authors={aut_list} segments="23" views="1250"
          comments="89" rating="4.8" updated="2 hours"
        />
        <StoryThumbnail
          src={viteLogo} alt='image' title="Lorem ipsum dolor sit amet." desc="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt, laudantium."
          tags={tag_list} authors={aut_list} segments="15" views="1100"
          comments="92" rating="4.7" updated="1 day"
        />
        <StoryThumbnail
          src={viteLogo} alt='image' title="Lorem ipsum dolor sit amet." desc="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt, laudantium."
          tags={tag_list} authors={aut_list} segments="18" views="892"
          comments="64" rating="4.6" updated="4 hours"
        />
      </section>
      <h2>Section 2</h2>
      <section>
        <ActivityBox src={reactLogo} alt='image' username="username" desc="Lorem ipsum dolor sit amet." updated="2 hours"/>
        <ActivityBox src={viteLogo} alt='image' username="username" desc="Lorem ipsum dolor sit amet." updated="5 hours"/>
        <ActivityBox src={reactLogo} alt='image' username="username" desc="Lorem ipsum dolor sit amet." updated="8 hours"/>
      </section>
    </>
  )
}

export default Home