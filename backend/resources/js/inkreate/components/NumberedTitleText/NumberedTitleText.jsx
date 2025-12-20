
import styles from './NumberedTitleText.module.css';

function NumberedTitleText({ number, title, children }) {
  return (
    <div className={styles.box}>
      <div className={styles.circle}>{number}</div>
      <h3>{title}</h3>
      <div className={styles.copy}>{children}</div>
    </div>
  );
}

export default NumberedTitleText;
