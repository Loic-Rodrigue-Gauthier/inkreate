
import SearchBox from '../../components/SearchBox/SearchBox'
import StoryThumbnailList from '../../components/StoryThumbnailList/StoryThumbnailList'
import styles from './Search.module.css'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'

function Search() {
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
  //

  return (
    <>
      <h1>Discover</h1>
      <SearchBox />
      <StoryThumbnailList stories={stories}/>
    </>
  )
}

export default Search