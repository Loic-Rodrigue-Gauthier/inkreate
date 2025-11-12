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
      paragraph: "Lorem 1...",
      choices: [{id: 4, text: "choice4"}, {id: 5, text: "choice5"}, {id: 6, text: "choice6"}],
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
    <div>
      <button onClick={onClose}>❌</button>
      <button onClick={() => segID(segments[0].id)}>Story Cover</button>
      <div>
        {allChoices.map((choice) => (
          <div key={choice.id}>
            <h3>{choice.text}</h3>
            {segments
              .filter((seg) => seg.id === choice.id)
              .map((seg) => (
                <button
                  key={seg.id}
                  onClick={() => segID(seg.id)}
                >
                  {seg.paragraph}
                </button>
              ))}
          </div>
        ))}
      </div>
    </div>,
    document.body
  )
}

export default StoryOverview