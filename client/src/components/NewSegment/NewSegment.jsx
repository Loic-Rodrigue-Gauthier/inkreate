import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { LinkedList } from "../../utils/LinkedList";
import DiscardableChip from "../DiscardableChip/DiscardableChip";
import SegmentImageText from "../SegmentImageText/SegmentImageText";
import styles from "./NewSegment.module.css";
import bliss from "../../assets/bliss.jpg";
import coverPlaceholder from "../../assets/cover.svg";

function NewSegment({ isOpen, onClose, isPortal, isFirst, setSegData }) {
  const [inputs, setInputs] = useState({});
  const [selected, setSelected] = useState({});
  const [segmentImage, setSegmentImage] = useState(coverPlaceholder);
  const [choiceList, setChoiceList] = useState(() => new LinkedList());

  const updateValue = (e) => {
    setInputs((values) => ({ ...values, [e.target.name]: e.target.value }));
  };

  const updateSelected = (e) => {
    setSelected((values) => ({ ...values, [e.target.name]: e.target.value }));
  };

  const updateSegmentImage = () => {
    setSegmentImage(bliss);
  };

  const handleSegmentFile = (file) => {
    if (!file) return;
    // The parent can optionally pass setSegData to store the URL; we handle upload there.
    if (typeof setSegData === "function") {
      setSegData((prev) => ({ ...prev, _uploadFile: file }));
    }
    const reader = new FileReader();
    reader.onload = () => setSegmentImage(reader.result);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!isFirst) return;
    setSegData((prev) => ({
      ...prev,
      _uploadFile: prev?._uploadFile,
      content: inputs.paragraph || "",
      image_url: segmentImage,
      choices: choiceList.toArray().map((c) => c.text),
      pending_choice: selected.choice || "",
    }));
  }, [inputs, choiceList, segmentImage, isFirst, setSegData, selected.choice]);

  const removeChoice = (text) => {
    setChoiceList((prev) => {
      const list = prev.clone();
      list.removeByValue("text", text);

      return list;
    });
  };

  const addChoices = () => {
    const newChoice = { text: selected.choice };

    setChoiceList((prev) => {
      const list = prev.clone();
      const exists = list
        .toArray()
        .some((choice) => choice.text === newChoice.text);

      if (!exists) {
        list.addLast(newChoice);
      }

      return list;
    });

    setSelected((prev) => ({ ...prev, choice: "" }));
  };

  const createSegment = () => {
    setInputs({});
    setSegmentImage();
    setChoiceList(new LinkedList());
    onClose && onClose();
  };

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
        onFileSelect={handleSegmentFile}
      />
      <label>
        Add choice:
        <input
          className={styles.choice_input}
          type="text"
          name="choice"
          value={selected.choice || ""}
          onChange={updateSelected}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addChoices();
            }
          }}
        />
      </label>
      <div className={styles.chips}>
        {choiceList.toArray().map((choice, index) => (
          <DiscardableChip
            key={index}
            src={choice.src}
            text={choice.text}
            removeChip={removeChoice}
          />
        ))}
      </div>
      {!isFirst && (
        <button onClick={createSegment} className={styles.send_button}>
          Publish Segment
        </button>
      )}
    </>
  );

  if (isPortal && !isOpen) return null;

  return isPortal ? (
    createPortal(
      <div
        className={styles.bg}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div className={styles.main_portal}>
          <div className={styles.header}>
            <h2>New Segment</h2>
            <button onClick={onClose}>✕</button>
          </div>
          {component}
        </div>
      </div>,
      document.body,
    )
  ) : (
    <div className={styles.main}>{component}</div>
  );
}

export default NewSegment;
