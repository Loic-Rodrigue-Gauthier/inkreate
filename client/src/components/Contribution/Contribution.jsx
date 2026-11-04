import styles from "./Contribution.module.css";

function Contribution({ title, segment, choice, paragraph }) {
  return (
    <div className={styles.main}>
      <div>
        <h2>{title}</h2>
        <div>
          Segment: <span className={styles.bubble}>#{segment}</span>
        </div>
      </div>
      <div>
        <div className={styles.choiceTitle}>
          Choice: <span className={styles.bubble}>{choice}</span>
        </div>
        <div>{paragraph}</div>
      </div>
    </div>
  );
}

export default Contribution;
