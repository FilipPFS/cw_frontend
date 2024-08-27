import React, { useEffect, useState } from "react";
import styles from "./UserAccount.module.css";
import UserImages from "../../components/UserImages/UserImages";
import { User } from "../../components/SignlePost/SinglePost";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header/Header";

type Props = {};

const UserAccount = (props: Props) => {
  const [user, setUser] = useState<User>();
  const { userId } = useParams();

  const getUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/${userId}`
      );

      setUser(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.homeContainer}>
        {user && <UserImages user={user} isEditable={false} />}
      </div>
    </div>
  );
};

export default UserAccount;
