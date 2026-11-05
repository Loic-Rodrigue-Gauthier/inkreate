import ActivityBoxList from "../../components/ActivityBoxList/ActivityBoxList";
import styles from "./Activity.module.css";
import avatarPlaceholder from "../../assets/avatar.svg";
import { useI18n } from "../../context/I18nContext";

function Activity() {
  const { t } = useI18n();

  const activity = [
    {
      src: avatarPlaceholder,
      alt: "image",
      username: "Username1",
      desc: "added a new segment to 'Mystery at Moonlight Manor'",
      updated: "2 hours",
    },
    {
      src: avatarPlaceholder,
      alt: "image",
      username: "Username2",
      desc: "commented on your story",
      updated: "5 hours",
    },
    {
      src: avatarPlaceholder,
      alt: "image",
      username: "Username1",
      desc: "started following you",
      updated: "8 hours",
    },
  ];

  return (
    <div className={styles.page}>
      <h1>404 - {t("fourZeroFour.title")}</h1>
      {/* <ActivityBoxList activity={activity}/> */}
    </div>
  );
}

export default Activity;
