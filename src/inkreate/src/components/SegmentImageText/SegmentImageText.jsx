
import styles from './SegmentImageText.module.css'

function SegmentImageText({src, alt='image', img_title, txt_title, name, inputs, updateValue, updateImage}) {
  return (
    <div className={styles.box}>
      <h3>{img_title}</h3>
      <div onClick={updateImage}>
        <img src={src} alt={alt} />
      </div>
      <h3>{txt_title}</h3>
      <textarea
        name={name}
        value={inputs[name]}
        onChange={updateValue}
      />
    </div>
  )
}

export default SegmentImageText