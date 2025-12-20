
import styles from './SegmentImageText.module.css'
import { useRef } from 'react'

function SegmentImageText({ src, alt = 'image', img_title, txt_title, name, inputs, updateValue, onFileSelect }) {
  const fileInputRef = useRef(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect?.(file)
    }
  }

  return (
    <div className={styles.main}>
      <h3>{img_title}</h3>
      <div className={styles.seg_pic} onClick={handleClick}>
        <img src={src} alt={alt} />
        <div className={styles.overlay}>Click to upload</div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <h3>{txt_title}</h3>
      <textarea
        className={styles.seg_area}
        placeholder='Write here!'
        name={name}
        value={inputs[name] || ''}
        onChange={updateValue}
      />
    </div>
  )
}

export default SegmentImageText
