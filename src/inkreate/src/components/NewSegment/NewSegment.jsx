import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import DiscardableChip from '../DiscardableChip/DiscardableChip'
import SegmentImageText from '../SegmentImageText/SegmentImageText'
import styles from './NewSegment.module.css'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'

function NewSegment({isOpen, onClose, isPortal, isFirst, segData, setSegData, choiceID}) {
  const [inputs, setInputs] = useState({})
  const [selected, setSelected] = useState({})
  const [segmentImage, setSegmentImage] = useState(viteLogo)
  const [choiceList, setChoiceList] = useState([])

  const updateValue = (e) => {
    setInputs(values => ({...values, [e.target.name]: e.target.value}))
  }

  const updateSelected = (e) => {
    setSelected(values => ({...values, [e.target.name]: e.target.value}))
  }

  const updateSegmentImage = () => {
    // Windows Open file prompt...

    setSegmentImage(reactLogo)
  }

  useEffect(() => {
    if (!isFirst) return

    setSegData(prev => ({
      ...prev,
      paragraph: inputs.paragraph || "",
      segmentImage,
      choices: [...choiceList],
    }));
  }, [inputs, choiceList, segmentImage, isFirst])

  const removeChoice = (text) => {
    setChoiceList(prev => prev.filter((choice) => choice.text != text))
  }

  const addChoices = () => {
    const newChoice = { text: selected.choice }
    setChoiceList(prev => {
      const exists = prev.some(choice => choice.text === newChoice.text)
      return exists ? prev : [...prev, newChoice]
    })
    setSelected(prev => ({...prev, choice: ""}))
  }

  const createSegment = () => {
    // DB code here...

    setInputs({})
    setSegmentImage(viteLogo)
    setChoiceList([])
    onClose()
  }

  const component = (
    <div>
      {isPortal &&
        <button onClick={onClose}>❌</button>
      }
      <SegmentImageText
        src={segmentImage}
        img_title="New Segment"
        name="paragraph"
        inputs={inputs}
        updateValue={updateValue}
        updateImage={updateSegmentImage}
      />
      <label>Add choice:
        <input
          type="text" 
          name="choice" 
          value={selected.choice}
          onChange={updateSelected}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              addChoices()
            }
          }}
        />
      </label>
      <div>
        {choiceList
        .map((choice, index) => (
          <DiscardableChip
            key={index}
            src={choice.src}
            text={choice.text}
            removeChip={removeChoice}
          />
        ))}
      </div>
      {!isFirst &&
        <button onClick={createSegment}>Publish Segment</button>
      }
    </div>
  )
  
  if (isPortal) {
    if (!isOpen) return null
  }

  return isPortal ? createPortal(component, document.body) : component
}

export default NewSegment