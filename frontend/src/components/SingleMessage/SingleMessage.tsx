import React, { useEffect, useState } from "react";
import { User } from "../SignlePost/SinglePost";
import axios from "axios";
import noAvatar from "../../images/no-avatar.png";
import styles from "./SingleMessage.module.css";

type Props = {
  senderId: string;
  content: string;
  userId: string;
};

const SingleMessage = ({ senderId, content, userId }: Props) => {
  const [msgUser, setMsgUser] = useState<User>();

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
    getMsgUser();
  }, []);

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
      <p
        className={`${styles.content} ${
          senderId === userId ? styles.senderContent : styles.userContent
        }`}
      >
        {content}
      </p>
    </div>
  );
};

export default SingleMessage;
