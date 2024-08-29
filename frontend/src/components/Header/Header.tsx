import { Link } from "react-router-dom";
import {
  FaBible,
  FaCalendar,
  FaEnvelope,
  FaHome,
  FaMusic,
  FaSignOutAlt,
} from "react-icons/fa";
import logo from "../../images/logo.webp";
import styles from "./Header.module.css";
import { User, user } from "../../user";
import { useEffect, useState } from "react";
import axios from "axios";
import noAvatar from "../../images/no-avatar.png";

type Props = {};

const Header = (props: Props) => {
  const [user, setUser] = useState<User>();

  const getSessionUser = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/session",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getSessionUser();
  }, []);

  const signOut = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="logo" />
      </div>
      <nav className={styles.nav}>
        <Link to={"/"}>
          <FaHome className={styles.icon} />
          Accueil
        </Link>
        <Link to={"/messages"}>
          <FaEnvelope className={styles.icon} />
          Messages
        </Link>
        <Link to={"/"}>
          <FaCalendar className={styles.icon} />
          Evenements
        </Link>
        <Link to={"/"}>
          <FaBible className={styles.icon} />
          Bible
        </Link>
        <Link to={"/"}>
          <FaMusic className={styles.icon} />
          Musique
        </Link>
        <Link to={"/my-account"} className={styles.userLink}>
          <div className={styles.userLinkImg}>
            <img src={user?.avatar ? user?.avatar : noAvatar} />
          </div>
          {`${user?.firstName} ${user?.lastName}`}
        </Link>
        <button onClick={signOut}>
          <FaSignOutAlt />
          Decconexion
        </button>
      </nav>
    </header>
  );
};

export default Header;
