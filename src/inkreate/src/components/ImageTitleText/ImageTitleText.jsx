
import styles from './ImageTitleText.module.css'

function ImageTitleText({src, alt='image', title, children}) {
  return (
    <div className={styles.box}>
      <div>
        <img src={src} alt={alt} />
      </div>
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  )
}

export default ImageTitleText