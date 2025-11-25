import { createPortal } from 'react-dom'
import styles from './StoryOverview.module.css'

function StoryOverview({isOpen, onClose, segID}) {
  const segments = [
    {
      id: 999,
      title: "Story Title",
      paragraph: "Story desc...",
      choices: [{id: 0, text: "Start reading"}],
    },
    {
      id: 0,
      title: "Start reading",
      paragraph: "Lorem 0...",
      choices: [{id: 1, text: "choice1"}, {id: 2, text: "choice2"}, {id: 3, text: "choice3"}],
    },
    {
      id: 1,
      title: "choice1",
      paragraph: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit voluptates deleniti minus consectetur non qui vero natus id maxime? Maxime, perferendis itaque suscipit accusamus aliquam nemo quod autem culpa consequuntur.",
      choices: [{id: 4, text: "choice4"}, {id: 5, text: "choice5"}, {id: 6, text: "choice6"}],
    },
    {
      id: 1,
      title: "choice1",
      paragraph: "Lorem 5...",
      choices: [{id: 7, text: "choice7"}, {id: 8, text: "choice8"}, {id: 9, text: "choice9"}],
    },
    {
      id: 1,
      title: "choice1",
      paragraph: "Lorem 21...",
      choices: [{id: 10, text: "choice10"}, {id: 11, text: "choice11"}, {id: 12, text: "choice12"}],
    },
    {
      id: 1,
      title: "choice1",
      paragraph: "Lorem 132...",
      choices: [{id: 13, text: "choice13"}, {id: 14, text: "choice14"}, {id: 15, text: "choice15"}],
    }
  ]
  const allChoices = [
    ...new Map(
      segments
        .flatMap((seg) => seg.choices)
        .map((choice) => [choice.text, choice])
    ).values(),
  ]

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
          <h2>Table of Contents</h2>
          <button
            onClick={onClose}>
            ❌
          </button>
        </div>
        <div className={styles.body}>
          <button
            className={styles.first}
            onClick={() => segID(segments[0].id)}>
            Story Cover
          </button>
          <div className={styles.choices_segs}>
            {allChoices.map((choice) => (
              <div key={choice.id}>
                <h3>{choice.text}</h3>
                <div className={styles.segs}>
                  {segments.filter(seg => seg.id === choice.id).length ? (
                    segments
                      .filter(seg => seg.id === choice.id)
                      .map((seg) => (
                      <button
                        key={seg.id}
                        onClick={() => segID(seg.id)}
                      >
                        {seg.paragraph}
                      </button>
                    ))
                  ) : (<div>No segment yet!</div>)
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default StoryOverview