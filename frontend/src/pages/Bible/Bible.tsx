import { FaLock } from "react-icons/fa";
import Header from "../../components/Header/Header";
import styles from "./Bible.module.css";

type Props = {};

const Bible = (props: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        <div className={styles.lock}>
          <FaLock className={styles.icon} />
          <span>Seulement les membres premium peuvent voir cette page</span>
          <button disabled>Acheter Premium</button>
        </div>
      </div>
    </div>
  );
};

export default Bible;
