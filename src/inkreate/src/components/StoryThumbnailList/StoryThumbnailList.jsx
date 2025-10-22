
import StoryThumbnail from '../StoryThumbnail/StoryThumbnail'
import styles from './StoryThumbnailList.module.css'

function StoryThumbnailList({stories}) {
  return (
    <div>
      {stories.map((story, index) => (
        <StoryThumbnail
          key={index}
          {...story}
        />
      ))}
    </div>
  )
}

export default StoryThumbnailList