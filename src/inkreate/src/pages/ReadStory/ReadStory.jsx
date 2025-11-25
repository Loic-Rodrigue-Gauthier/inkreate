import { useState, useEffect } from 'react'
import ChatContact from '../../components/ChatContact/ChatContact'
import ChatBubble from '../../components/ChatBubble/ChatBubble'
import StoryOverview from '../../components/StoryOverview/StoryOverview'
import styles from './ReadStory.module.css'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'
import bliss from '../../assets/bliss.jpg'
import pfp from '../../assets/pfp.svg'
import SegmentThumbnailList from '../../components/SegmentThumbnailList/SegmentThumbnailList'

function ReadStory() {
  const [isChoiceOpen, setIsChoiceOpen] = useState(false)
  const [isOverviewOpen, setIsOverviewOpen] = useState(false)
  const [isRating, setIsRating] = useState(false)
  const [rating, setRating] = useState("")
  const [isFavorited, setIsFavorited] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [comment, setComment] = useState("")
  const [commentSection, setCommentSection] = useState([])
  const [selectedChoice, setSelectedChoice] = useState()
  const segment = {
    id: 123,
    src: bliss,
    title: "Segment Title",
    paragraph: "Paragraph Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor quod, rem error incidunt modi labore iste tempore. Temporibus aperiam, ea voluptatem ullam odio esse! Dignissimos culpa ut quos hic quis? Vitae, laboriosam. Tenetur architecto quas aliquam alias reprehenderit est, iste, quidem, voluptas deleniti inventore eius ratione impedit beatae corporis accusantium!",
    choices: [{id: 1, text: "choice1"}, {id: 2, text: "choice2"}, {id: 3, text: "choice3"}],
    author: {src: pfp, username: "Author"},
    rating: "4.7",
    timestamp: "1/15/2025",
    views: "1250",
    favorites: "1.2k",
    bookmarks: "523",
  }

  const previousPage = () => {
    // DB code here...
    
  }

  const updateRating = (e) => {
    setRating(e.target.value)
    // DB code here...

    setIsRating(false)
  }

  useEffect(() => {
    if (isFavorited !== null) {
      // DB code here...

    }
  }, [isFavorited])

  useEffect(() => {
    if (isBookmarked !== null) {
      // DB code here...

    }
  }, [isBookmarked])

  const updateComment = (e) => {
    setComment(e.target.value)
  }

  const updateSegment = (segID) => {
    // DB code here...
    
    setIsOverviewOpen(false)
    setIsChoiceOpen(false)
  }
  
  return (
    <div className={styles.main}>
      <img
        className={styles.seg_pic}
        src={segment.src}
        alt=""
      />
      <h2>{segment.title}</h2>
      <div>{segment.paragraph}</div>
      <div className={styles.choices}>
        {segment.choices
        .map((choice, index) => (
          <button
            className={styles.choice_button}
            key={index}
            onClick={() => {
              setSelectedChoice(choice.id)
              setIsChoiceOpen(true)
            }}
          >
            {choice.text}
          </button>
        ))}
      </div>
      <SegmentThumbnailList
        isOpen={isChoiceOpen}
        onClose={() => setIsChoiceOpen(false)}
        segID={updateSegment}
        choiceID={selectedChoice}
      />
      <div className={styles.seg_nav}>
        <button className={styles.nav_button} onClick={previousPage}>⬅️</button>
        <button className={styles.nav_button} onClick={() => setIsOverviewOpen(true)}>📑</button>
      </div>
      <StoryOverview
        isOpen={isOverviewOpen}
        onClose={() => setIsOverviewOpen(false)}
        segID={updateSegment}
      />
      <div className={styles.author_rating}>
        <ChatContact
          src={segment.author.src}
          username={segment.author.username}
        />
        {!isRating &&
          <button
            className={styles.rate_fave_book}
            onClick={() => setIsRating(true)}>{rating >=1 ? "✔️ " : "⭐ "}
            {segment.rating}
          </button>
        }
        {isRating &&
          <select 
            name="rating"
            value={rating}
            onChange={updateRating}
          >
            <option value="" disabled hidden>Not rated</option>
            <option value="1">1 ⭐</option>
            <option value="2">2 ⭐</option>
            <option value="3">3 ⭐</option>
            <option value="4">4 ⭐</option>
            <option value="5">5 ⭐</option>
          </select>
        }
      </div>
      <div className={styles.seg_stats}>
        <div className={styles.date_views}>
          <div>🕓 {segment.timestamp}</div>
          <div>👁️ {segment.views}</div>
        </div>
        <div>
          <button
            className={styles.rate_fave_book}
            onClick={() => setIsFavorited(isFavorited ? false : true)}>{isFavorited ? "✔️ " : "❤️ "}
            {segment.favorites}
          </button>
          <button
            className={styles.rate_fave_book}
            onClick={() => setIsBookmarked(isBookmarked ? false : true)}>{isBookmarked ? "✔️ " : "🔖 "}
            {segment.bookmarks}
          </button>
        </div>
      </div>
      <textarea
        className={styles.comment_area}
        placeholder='Comment on this segment!'
        name="comment" 
        value={comment}
        onChange={updateComment}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            
            const newComment = { id: segment.id, src: pfp, username: "LoggedInUser", message: comment, timestamp: new Date().toLocaleDateString()}
            setCommentSection(prev => [...prev, newComment])
            // DB code here...

            setComment("")
          }
        }}
      />
      <h3>Comments ({commentSection.length})</h3>
      <div className={styles.comment_bubbles}>
        {commentSection
        .filter((comment) => comment.id === segment.id)
        .map((comment, index) => (
          <ChatBubble
            key={index}
            {...comment}
          />
        ))}
      </div>
    </div>
  )
}

export default ReadStory