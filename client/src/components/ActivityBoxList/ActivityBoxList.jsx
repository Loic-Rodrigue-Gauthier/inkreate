import ActivityBox from "../ActivityBox/ActivityBox";
import styles from "./ActivityBoxList.module.css";

function ActivityBoxList({ activity }) {
  return (
    <div className={styles.main}>
      {activity.map((activity, index) => (
        <ActivityBox key={index} {...activity} />
      ))}
    </div>
  );
}

export default ActivityBoxList;
