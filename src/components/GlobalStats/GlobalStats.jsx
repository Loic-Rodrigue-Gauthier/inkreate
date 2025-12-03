
import styles from './GlobalStats.module.css'

function GlobalStats({number, desc}) {
  return (
    <div className={styles.box}>
      <div><h3>{number}</h3></div>
      <p>{desc}</p>
    </div>
  )
}

export default GlobalStats