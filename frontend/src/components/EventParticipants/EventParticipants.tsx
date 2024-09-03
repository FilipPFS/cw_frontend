import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import noAvatar from "../../images/no-avatar.png";
import { Link } from "react-router-dom";
import { User } from "../SignlePost/SinglePost";
import styles from "./EventParticipants.module.css";

type Props = {
  userId: string;
};

const EventParticipants = ({ userId }: Props) => {
  const [user, setUser] = useState<User>();

  const getUser = async () => {
    try {
      const response: AxiosResponse<User> = await axios.get(
        `http://localhost:5000/api/users/${userId}`
      );

      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <section className={styles.container}>
      <img src={user?.avatar ? user.avatar : noAvatar} />
      <Link to={`/user/${user?._id}`}>
        <h3>
          {user?.firstName} {user?.lastName}
        </h3>
      </Link>
    </section>
  );
};

export default EventParticipants;
