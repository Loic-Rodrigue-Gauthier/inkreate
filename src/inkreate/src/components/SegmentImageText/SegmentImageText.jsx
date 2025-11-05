
import styles from './SegmentImageText.module.css'

function SegmentImageText({src, alt='image', img_title, txt_title, inputs, updateValue, updateImage}) {
  return (
    <div className={styles.box}>
      <h3>{img_title}</h3>
      <div onClick={updateImage}>
        <img src={src} alt={alt} />
      </div>
      <h3>{txt_title}</h3>
      <textarea
        name="desc"
        value={inputs.desc}
        onChange={updateValue}
      />
    </div>
  )
}

export default SegmentImageText