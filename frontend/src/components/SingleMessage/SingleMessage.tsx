import React, { useEffect, useState } from "react";
import { User } from "../SignlePost/SinglePost";
import axios from "axios";
import noAvatar from "../../images/no-avatar.png";
import styles from "./SingleMessage.module.css";
import { formatDistanceToNow, setMilliseconds } from "date-fns";
import { fr } from "date-fns/locale";
import { useParams } from "react-router-dom";
import { Message } from "../../pages/Chat/Chat";

type Props = {
  senderId: string;
  content: string;
  userId: string;
  date: string;
  sessionId: string;
  messageId: string;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
};

const SingleMessage = ({
  senderId,
  content,
  userId,
  date,
  sessionId,
  messageId,
  setMessages,
}: Props) => {
  const [msgUser, setMsgUser] = useState<User>();
  const [viewDate, setViewDate] = useState(false);
  const { userMsgId } = useParams();

  const formatDateToNow = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
  };

  const getMsgUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/${senderId}`
      );

      setMsgUser(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!msgUser || msgUser._id !== senderId) {
      getMsgUser();
      console.log("Rerendered");
    }
  }, [senderId, msgUser, setMessages]); // Adjust dependencies to re-fetch only when necessary

  const deleteMessage = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/messages/delete/${userMsgId}/${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`${styles.singleMsg} ${
        senderId === userId ? styles.senderMsg : styles.userMsg
      }`}
    >
      <img
        src={msgUser?.avatar ? msgUser.avatar : noAvatar}
        className={`${styles.avatar} ${
          senderId === userId ? styles.senderAvatar : styles.userAvatar
        }`}
      />
      <div
        className={`${styles.content} ${
          senderId === userId ? styles.senderContent : styles.userContent
        }`}
      >
        <p onClick={() => setViewDate((prevDate) => !prevDate)}>{content}</p>
        {viewDate && (
          <section className={styles.smallInfos}>
            <small
              className={
                senderId === userId ? styles.senderSmall : styles.userSmall
              }
            >
              {formatDateToNow(date)}
            </small>
            <small>{senderId === sessionId && "·"}</small>
            <small className={styles.smallDelete} onClick={deleteMessage}>
              {senderId === sessionId && "Supprimez"}
            </small>
          </section>
        )}
      </div>
    </div>
  );
};

export default SingleMessage;
