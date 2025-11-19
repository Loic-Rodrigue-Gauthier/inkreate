
import StoryThumbnailList from '../../components/StoryThumbnailList/StoryThumbnailList'
import styles from './Bookmarked.module.css'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'

function Bookmarked() {
  // temp_test
  const aut_list = [reactLogo, viteLogo]
  const tag_list = ["tag1", "tag2", "tag3"]
  const stories = [
    { src: viteLogo, alt:'image', title:"Lorem ipsum dolor sit amet.", desc:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt, laudantium.",
      tags: tag_list, authors: aut_list, segments:"23", views:"1250",
      comments:"89", rating:"4.8", updated:"2 hours", favorited:"1.2k", bookmarked:"512" },
    { src: viteLogo, alt:'image', title:"Lorem ipsum dolor sit amet.", desc:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt, laudantium.",
      tags: tag_list, authors: aut_list, segments:"23", views:"1250",
      comments:"89", rating:"4.8", updated:"2 hours", favorited:"1.2k", bookmarked:"512" },
    { src: viteLogo, alt:'image', title:"Lorem ipsum dolor sit amet.", desc:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt, laudantium.",
      tags: tag_list, authors: aut_list, segments:"23", views:"1250",
      comments:"89", rating:"4.8", updated:"2 hours", favorited:"1.2k", bookmarked:"512" },
  ]
  //

  return (
    <>
      <h1>Continue Reading</h1>
      <StoryThumbnailList stories={stories}/>
    </>
  )
}

export default Bookmarked