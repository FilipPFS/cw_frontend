import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import styles from "./Chat.module.css";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import noAvatar from "../../images/no-avatar.png";
import { User } from "../../components/SignlePost/SinglePost";
import { log } from "console";
import SingleMessage from "../../components/SingleMessage/SingleMessage";
import { FaPaperPlane } from "react-icons/fa";

type Props = {};

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  date: string;
};

const Chat = (props: Props) => {
  const [user, setUser] = useState<User>();
  const [sessionUser, setSessionUser] = useState<User>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
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

  const getMessages = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `http://localhost:5000/api/messages/from/${userId}`,
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

  const submitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `http://localhost:5000/api/messages/new/${userId}`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContent("");
      setMessages(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUser();
    getSessionUser();
    getMessages();
  }, []);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.mainContainer}>
        <div className={styles.userInfo}>
          <img src={user?.avatar ? user.avatar : noAvatar} />
          <Link to={`/user/${user?._id}`}>
            <h3>
              {user?.firstName} {user?.lastName}
            </h3>
          </Link>
        </div>
        <div className={styles.messages}>
          {messages.map((message) => {
            return (
              <SingleMessage
                key={message.id}
                senderId={message.senderId}
                content={message.content}
                userId={user ? user._id : ""}
              />
            );
          })}
        </div>
        <form className={styles.form} onSubmit={submitMessage}>
          <input
            type="text"
            placeholder="Ecrire un message"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button type="submit">
            <FaPaperPlane className={styles.btnIcon} />
          </button>
          <img
            src={sessionUser?.avatar ? sessionUser.avatar : noAvatar}
            className={styles.formAvatar}
          />
        </form>
      </div>
    </div>
  );
};

export default Chat;
