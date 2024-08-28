import React, { useEffect, useState } from "react";
import styles from "./UserAccount.module.css";
import UserImages from "../../components/UserImages/UserImages";
import { User } from "../../components/SignlePost/SinglePost";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header/Header";
import UserInfo from "../../components/UserInfo/UserInfo";

type Props = {};

const UserAccount = (props: Props) => {
  const [user, setUser] = useState<User>();
  const [sessionUser, setSessionUser] = useState<User>();
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
    getUser();
    getSessionUser();
  }, []);

  const navigate = useNavigate();

  if (sessionUser?._id === userId) {
    navigate("/my-account");
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.homeContainer}>
        {user && <UserImages user={user} isEditable={false} />}
        {user && <UserInfo user={user} editable={false} />}
      </div>
    </div>
  );
};

export default UserAccount;
