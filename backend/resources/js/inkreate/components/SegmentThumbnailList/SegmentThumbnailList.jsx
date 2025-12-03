import { useState } from 'react'
import { createPortal } from 'react-dom'
import SegmentThumbnail from '../SegmentThumbnail/SegmentThumbnail'
import NewSegment from '../NewSegment/NewSegment'
import styles from './SegmentThumbnailList.module.css'
import bliss from '../../assets/bliss.jpg'

function SegmentThumbnailList({isOpen, onClose, segID, choiceID}) {
  const [page, setPage] = useState(1)
  const [isSegmentOpen, setIsSegmentOpen] = useState(false)
  const segments = [
    {
      id: 1,
      src: bliss,
      paragraph: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet, itaque...",
      timestamp: "1/15/2024",
      views: "1250",
      rating: "4.7",
      favorited: "1.2k",
      bookmarked: "523",
      comments: "3"
    },
    {
      id: 2,
      src: bliss,
      paragraph: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet, itaque...",
      timestamp: "2/15/2024",
      views: "2250",
      rating: "3.7",
      favorited: "2.2k",
      bookmarked: "623",
      comments: "4"
    },
    {
      id: 3,
      src: bliss,
      paragraph: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet, itaque...",
      timestamp: "3/15/2024",
      views: "3250",
      rating: "2.7",
      favorited: "3.2k",
      bookmarked: "723",
      comments: "5"
    },
    {
      id: 3,
      src: bliss,
      paragraph: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet, itaque...",
      timestamp: "3/15/2024",
      views: "3250",
      rating: "2.7",
      favorited: "3.2k",
      bookmarked: "723",
      comments: "5"
    },
    {
      id: 3,
      src: bliss,
      paragraph: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet, itaque...",
      timestamp: "3/15/2024",
      views: "3250",
      rating: "2.7",
      favorited: "3.2k",
      bookmarked: "723",
      comments: "5"
    },
    {
      id: 3,
      src: bliss,
      paragraph: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet, itaque...",
      timestamp: "3/15/2024",
      views: "3250",
      rating: "2.7",
      favorited: "3.2k",
      bookmarked: "723",
      comments: "5"
    },
    {
      id: 3,
      src: bliss,
      paragraph: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet, itaque...",
      timestamp: "3/15/2024",
      views: "3250",
      rating: "2.7",
      favorited: "3.2k",
      bookmarked: "723",
      comments: "5"
    },
  ]
  const numberOfPages = Math.ceil(segments.filter((segment) => segment.id === choiceID).length / 5)

  const previousPage = () => {
    setPage((prev) => prev - 1)
    updatePage()
  }

  const nextPage = () => {
    setPage((prev) => prev + 1)
    updatePage()
  }

  const updatePage = () => {
    // DB code here...
    
  }

  if (!isOpen) return null

  return createPortal(
    <div
      className={styles.bg}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className={styles.main}>
        <div className={styles.header}>
          <h2>Choose a segment!</h2>
          <button
            onClick={onClose}>
            ❌
          </button>
        </div>
        <div className={styles.segs}>
          {segments
          .filter((segment) => segment.id === choiceID)
          .map((segment, index) => (
            <SegmentThumbnail
              key={index}
              {...segment}
              thumbID={segID}
            />
          ))}
        </div>
        <div className={styles.page_buttons}>
          {page != 1 &&
            <button
              className={styles.back_next}
              onClick={previousPage}>
              ⬅️
            </button>
          }
          <select 
            name="pages"
            value={page}
            onChange={(e) => {setPage(Number(e.target.value))}}
          >
            {Array.from({ length: numberOfPages }, (_, i) => (
              <option
                key={i}
                value={i + 1}
              >
                {i + 1}
              </option>
            ))}
          </select>
          {page != numberOfPages &&
            <button
              className={styles.back_next}
              onClick={nextPage}>
              ➡️
            </button>
          }
        </div>
        <button onClick={() => setIsSegmentOpen(true)}>Add Segment ➕</button>
        <NewSegment
          isPortal={true}
          isFirst={false}
          isOpen={isSegmentOpen}
          onClose={() => setIsSegmentOpen(false)}
          choiceID={choiceID}
        />
      </div>
    </div>,
    document.body
  )
}

export default SegmentThumbnailList