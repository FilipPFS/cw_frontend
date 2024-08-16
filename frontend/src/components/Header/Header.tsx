import React from "react";
import { Link } from "react-router-dom";
import {
  FaBible,
  FaCalendar,
  FaEnvelope,
  FaHome,
  FaMusic,
} from "react-icons/fa";
import randomAvatar from "../../images/mrraandom.png";
import logo from "../../images/logo.webp";
import styles from "./Header.module.css";
import { log } from "console";

type Props = {};

type User = {
  avatar: string;
  firstName: string;
  lastName: string;
};

const Header = (props: Props) => {
  const user: User = {
    avatar: randomAvatar,
    firstName: "Filip",
    lastName: "Petrovic",
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
        <Link to={"/"}>
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
        <Link to={"/"} className={styles.userLink}>
          <div className={styles.userLinkImg}>
            <img src={user.avatar} />
          </div>
          {`${user.firstName} ${user.lastName}`}
        </Link>
      </nav>
    </header>
  );
};

export default Header;
