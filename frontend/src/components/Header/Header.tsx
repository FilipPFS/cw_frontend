import { Link } from "react-router-dom";
import {
  FaBible,
  FaCalendar,
  FaCalendarAlt,
  FaEnvelope,
  FaHome,
  FaMusic,
  FaSignOutAlt,
  FaUserFriends,
} from "react-icons/fa";
import logo from "../../images/logo.webp";
import styles from "./Header.module.css";
import { user } from "../../user";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import noAvatar from "../../images/no-avatar.png";
import { User } from "../SignlePost/SinglePost";
import { useUser } from "../../context/UserContext";

type Props = {};

const Header = ({}: Props) => {
  const { sessionUser } = useUser();

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
        <Link to={"/friends"}>
          <FaUserFriends className={styles.icon} />
          Mes amis
        </Link>
        <Link to={"/messages"}>
          <FaEnvelope className={styles.icon} />
          Messages
        </Link>
        <Link to={"/events"}>
          <FaCalendarAlt className={styles.icon} />
          Evenements
        </Link>
        <Link to={"/bible"}>
          <FaBible className={styles.icon} />
          Bible
        </Link>
        <Link to={"/music"}>
          <FaMusic className={styles.icon} />
          Musique
        </Link>
        <Link to={"/my-account"} className={styles.userLink}>
          <div className={styles.userLinkImg}>
            <img src={sessionUser?.avatar ? sessionUser?.avatar : noAvatar} />
          </div>
          {`${sessionUser?.firstName} ${sessionUser?.lastName}`}
        </Link>
        <button onClick={signOut} className={styles.signOutBtn}>
          <FaSignOutAlt />
          <span>Decconexion</span>
        </button>
      </nav>
    </header>
  );
};

export default Header;
