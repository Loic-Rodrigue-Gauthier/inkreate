import styles from "./UserStats.module.css";
import { useNavigate } from "react-router-dom";

function UserStats({ src, alt = "image", number, desc, to, state }) {
  const navigate = useNavigate();
  const handleClick = () => {
    if (to) navigate(to, state ? { state } : undefined);
  };

  return (
    <div
      className={styles.box}
      onClick={handleClick}
      role={to ? "button" : undefined}
      tabIndex={to ? 0 : undefined}
    >
      {/* <div>
        <img src={src} alt={alt} />
      </div> */}
      <div>
        <h3>{number}</h3>
      </div>
      <p>{desc}</p>
    </div>
  );
}

export default UserStats;
