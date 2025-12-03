
import styles from './SegmentImageText.module.css'

function SegmentImageText({src, alt='image', img_title, txt_title, name, inputs, updateValue, updateImage}) {
  return (
    <div className={styles.main}>
      <h3>{img_title}</h3>
      <div
        className={styles.seg_pic}
        onClick={updateImage}
      >
        <img src={src} alt={alt} />
      </div>
      <h3>{txt_title}</h3>
      <textarea
        className={styles.seg_area}
        placeholder='Write here!'
        name={name}
        value={inputs[name]}
        onChange={updateValue}
      />
    </div>
  )
}

export default SegmentImageText