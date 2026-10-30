
import styles from './DiscardableChip.module.css'

function DiscardableChip({src = null, alt='image', text, removeChip}) {
  return (
    <div
      className={styles.main}
      onClick={() => removeChip(text)}
    >
      {src && (
        <div>
          <img src={src} alt={alt} />
        </div>
      )}
      <div>{text}<span className={styles.close}>✖</span></div>
    </div>
  )
}

export default DiscardableChip