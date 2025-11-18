import { useState, useEffect } from 'react'
import ChatContact from '../../components/ChatContact/ChatContact'
import ChatBubble from '../../components/ChatBubble/ChatBubble'
import StoryOverview from '../../components/StoryOverview/StoryOverview'
import styles from './ReadStory.module.css'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'
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
    src: reactLogo,
    title: "Segment Title",
    paragraph: "Paragraph Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor quod, rem error incidunt modi labore iste tempore. Temporibus aperiam, ea voluptatem ullam odio esse! Dignissimos culpa ut quos hic quis? Vitae, laboriosam. Tenetur architecto quas aliquam alias reprehenderit est, iste, quidem, voluptas deleniti inventore eius ratione impedit beatae corporis accusantium!",
    choices: [{id: 1, text: "choice1"}, {id: 2, text: "choice2"}, {id: 3, text: "choice3"}],
    author: {src: viteLogo, username: "Author"},
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
    <>
      <img src={segment.src} alt="" />
      <h2>{segment.title}</h2>
      <div>{segment.paragraph}</div>
      <div>
        {segment.choices
        .map((choice, index) => (
          <button
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
      <button onClick={previousPage}>⬅️ Back</button>
      <button onClick={() => setIsOverviewOpen(true)}>📑 Table of Contents</button>
      <StoryOverview
        isOpen={isOverviewOpen}
        onClose={() => setIsOverviewOpen(false)}
        segID={updateSegment}
      />
      <div>
        <ChatContact
          src={segment.author.src}
          username={segment.author.username}
        />
        {!isRating &&
          <button onClick={() => setIsRating(true)}>{rating >=1 ? "✔️" : "⭐"} {segment.rating}</button>
        }
        {isRating &&
          <select 
            name="rating"
            value={rating}
            onChange={updateRating}
          >
            <option value="" disabled hidden>Not rated</option>
            <option value="1">⭐</option>
            <option value="2">⭐⭐</option>
            <option value="3">⭐⭐⭐</option>
            <option value="4">⭐⭐⭐⭐</option>
            <option value="5">⭐⭐⭐⭐⭐</option>
          </select>
        }
      </div>
      <div>
        <div>
          <div>🕓 {segment.timestamp}</div>
          <div>👁️ {segment.views}</div>
        </div>
        <div>
          <button onClick={() => setIsFavorited(isFavorited ? false : true)}>{isFavorited ? "✔️" : "❤️"} {segment.favorites}</button>
          <button onClick={() => setIsBookmarked(isBookmarked ? false : true)}>{isBookmarked ? "✔️" : "🔖"} {segment.bookmarks}</button>
        </div>
      </div>
      <textarea
        name="comment" 
        value={comment}
        onChange={updateComment}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            
            const newComment = { id: segment.id, src: reactLogo, username: "LoggedInUser", message: comment, timestamp: new Date().toLocaleDateString()}
            setCommentSection(prev => [...prev, newComment])
            // DB code here...

            setComment("")
          }
        }}
      />
      <h3>Comments ({commentSection.length})</h3>
      <div>
        {commentSection
        .filter((comment) => comment.id === segment.id)
        .map((comment, index) => (
          <ChatBubble
            key={index}
            {...comment}
          />
        ))}
      </div>
    </>
  )
}

export default ReadStory