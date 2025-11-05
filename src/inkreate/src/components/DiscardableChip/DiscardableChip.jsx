
import styles from './DiscardableChip.module.css'

function DiscardableChip({src = null, alt='image', text, removeChip}) {
  return (
    <div className={styles.box}>
      {src && (
        <div>
          <img src={src} alt={alt} />
        </div>
      )}
      <div>{text}</div>
      <button onClick={() => removeChip(text)}>✖</button>
    </div>
  )
}

export default DiscardableChip