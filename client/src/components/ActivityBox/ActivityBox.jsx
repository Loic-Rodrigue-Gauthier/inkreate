import styles from "./ActivityBox.module.css";
import avatar from "../../assets/avatar.svg";

function ActivityBox({ src, alt = "image", username, desc, updated }) {
  return (
    <div className={styles.box}>
      <div>
        <img src={avatar} alt={alt} />
      </div>
      <div>
        <p>
          <span>{username}</span> {desc}
        </p>
      </div>
      <div>{updated}</div>
    </div>
  );
}

export default ActivityBox;
