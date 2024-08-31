import { Link } from "react-router-dom";
import styles from "./MessageModal.module.css";
import { User } from "../SignlePost/SinglePost";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import noAvatar from "../../images/no-avatar.png";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

type Props = {
  senderId: string;
  receiverId: string;
  content: string;
  date: string;
};

const MessageModal = ({ senderId, receiverId, content, date }: Props) => {
  const [sessionUser, setSessionUser] = useState<User | undefined>(undefined);
  const [user, setUser] = useState<User | undefined>(undefined);

  const formatDateToNow = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
  };

  const getSessionUser = async () => {
    const token = localStorage.getItem("token");

    try {
      const response: AxiosResponse<User> = await axios.get(
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

  useEffect(() => {
    const getUser = async () => {
      if (!sessionUser) return;

      const userLink = senderId === sessionUser._id ? receiverId : senderId;

      try {
        const response: AxiosResponse<User> = await axios.get(
          `http://localhost:5000/api/users/${userLink}`
        );

        setUser(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    getUser();
  }, [sessionUser, senderId, receiverId]);

  if (!sessionUser || !user) {
    return null; // or a loading indicator
  }

  const customLink = senderId === sessionUser._id ? receiverId : senderId;

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  const contentMsg = truncateText(content, 150);

  console.log("date", date);

  return (
    <Link to={`/messages/${customLink}`} className={styles.container}>
      <img
        src={user.avatar ? user.avatar : noAvatar}
        className={styles.avatar}
      />
      <div>
        <h3 className={styles.username}>
          {user.firstName} {user.lastName}
        </h3>
        <small>{formatDateToNow(date)}</small>
        {senderId === sessionUser._id ? (
          <p className={styles.content}>Vous: {contentMsg}</p>
        ) : (
          <p className={styles.content}>
            {user.firstName}: {contentMsg}
          </p>
        )}
      </div>
    </Link>
  );
};

export default MessageModal;
