
import styles from './GlobalStats.module.css'

function GlobalStats({number, desc}) {
  return (
    <div className={styles.box}>
      <div className={styles.number}>{number}</div>
      <p className={styles.desc}>{desc}</p>
    </div>
  )
}

export default GlobalStats
