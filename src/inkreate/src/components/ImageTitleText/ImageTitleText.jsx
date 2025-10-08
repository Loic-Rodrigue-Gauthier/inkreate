
import styles from './ImageTitleText.module.css'

function ImageTitleText({src, alt='image', title, children}) {
  return (
    <div className={styles.box}>
      <img src={src} alt={alt} />
      <h3>{title}</h3>
      {children}
    </div>
  )
}

export default ImageTitleText