import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import noAvatar from "../../images/no-avatar.png";
import { User } from "../SignlePost/SinglePost";
import styles from "./SingleComment.module.css";
import { Link } from "react-router-dom";

type Props = {
  text: string;
  userId: string;
};

const SingleComment = ({ text, userId }: Props) => {
  const [user, setUser] = useState<User>();

  const getUser = async () => {
    try {
      const response: AxiosResponse<User> = await axios.get(
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
      <div>
        <img
          src={user?.avatar ? user.avatar : noAvatar}
          className={styles.avatar}
        />
      </div>
      <div className={styles.textCtn}>
        <Link to={"/"}>
          <p>
            {user?.firstName} {user?.lastName}
          </p>
        </Link>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default SingleComment;
