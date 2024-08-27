import React, { useEffect, useState } from "react";
import styles from "./MyAccount.module.css";
import Header from "../../components/Header/Header";
import BibleQuotes from "../../components/BibleQuotes/BibleQuotes";
import { User } from "../../components/SignlePost/SinglePost";
import axios from "axios";
import UserImages from "../../components/UserImages/UserImages";

type Props = {};

const MyAccount = (props: Props) => {
  const [sessionUser, setSessionUser] = useState<User>();

  const getSessionUser = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/session`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSessionUser(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getSessionUser();
  }, []);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.homeContainer}>
        {sessionUser && <UserImages user={sessionUser} isEditable={true} />}
      </div>
    </div>
  );
};

export default MyAccount;
