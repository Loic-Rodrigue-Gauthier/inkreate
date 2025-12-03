
import styles from './NumberedTitleText.module.css'

function NumberedTitleText({number, title, children}) {
  return (
    <div className={styles.box}>
      <div><h2>{number}</h2></div>
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  )
}

export default NumberedTitleText