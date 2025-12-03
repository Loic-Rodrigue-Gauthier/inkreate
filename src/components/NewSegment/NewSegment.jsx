import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import DiscardableChip from '../DiscardableChip/DiscardableChip'
import SegmentImageText from '../SegmentImageText/SegmentImageText'
import styles from './NewSegment.module.css'
import bliss from '../../assets/bliss.jpg'

function NewSegment({isOpen, onClose, isPortal, isFirst, segData, setSegData, choiceID}) {
  const [inputs, setInputs] = useState({})
  const [selected, setSelected] = useState({})
  const [segmentImage, setSegmentImage] = useState()
  const [choiceList, setChoiceList] = useState([])

  const updateValue = (e) => {
    setInputs(values => ({...values, [e.target.name]: e.target.value}))
  }

  const updateSelected = (e) => {
    setSelected(values => ({...values, [e.target.name]: e.target.value}))
  }

  const updateSegmentImage = () => {
    // Windows Open file prompt...

    setSegmentImage(bliss)
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
    setSegmentImage()
    setChoiceList([])
    onClose()
  }

  const component = (
    <>
      <SegmentImageText
        src={segmentImage}
        alt="Click to upload segment picture"
        img_title={isPortal ? "" : "First Segment"}
        name="paragraph"
        inputs={inputs}
        updateValue={updateValue}
        updateImage={updateSegmentImage}
      />
      <label>Add choice:
        <input
          className={styles.choice_input}
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
      <div className={styles.chips}>
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
        <button
          onClick={createSegment}
          className={styles.send_button}
        >
        Publish Segment
        </button>
      }
    </>
  )
  
  if (isPortal) {
    if (!isOpen) return null
  }

  return isPortal ? createPortal(
                      <div
                        className={styles.bg}
                        onClick={(e) => {
                          if (e.target === e.currentTarget) {
                            onClose()
                          }
                        }}
                      >
                        <div className={styles.main_portal}>
                          <div className={styles.header}>
                            <h2>New Segment</h2>
                            <button
                              onClick={onClose}>
                              ❌
                            </button>
                          </div>
                          {component}
                        </div>
                      </div>, document.body)
                  : <div className={styles.main}>
                      {component}
                    </div>
}

export default NewSegment