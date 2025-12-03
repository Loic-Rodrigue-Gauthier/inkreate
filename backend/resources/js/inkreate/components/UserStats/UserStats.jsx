
import styles from './UserStats.module.css'

function UserStats({src, alt='image', number, desc}) {
  return (
    <div className={styles.box}>
      <div>
        <img src={src} alt={alt} />
      </div>
      <div><h3>{number}</h3></div>
      <p>{desc}</p>
    </div>
  )
}

export default UserStats