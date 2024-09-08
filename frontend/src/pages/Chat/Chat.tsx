import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import styles from "./Chat.module.css";
import axios, { AxiosResponse } from "axios";
import { Link, useParams } from "react-router-dom";
import noAvatar from "../../images/no-avatar.png";
import { User } from "../../components/SignlePost/SinglePost";
import SingleMessage from "../../components/SingleMessage/SingleMessage";
import { FaPaperPlane } from "react-icons/fa";
import { useUser } from "../../context/UserContext";

type Props = {};

export type Message = {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  date: string;
};

const Chat = (props: Props) => {
  const [user, setUser] = useState<User>();
  const { sessionUser, setSessionUser } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const { userMsgId } = useParams();

  const getUser = async () => {
    try {
      const response: AxiosResponse<User> = await axios.get(
        `http://localhost:5000/api/users/${userMsgId}`
      );

      setUser(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getMessages = async () => {
    const token = localStorage.getItem("token");

    try {
      const response: AxiosResponse<Message[]> = await axios.get(
        `http://localhost:5000/api/messages/from/${userMsgId}`,
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

  const submitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response: AxiosResponse<Message[]> = await axios.post(
        `http://localhost:5000/api/messages/new/${userMsgId}`,
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
    getMessages();
  }, []);

  return (
    <div className={styles.container}>
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
          {messages.map((message, index) => {
            return (
              <SingleMessage
                key={index}
                senderId={message.senderId}
                content={message.content}
                userId={user ? user._id : ""}
                date={message.date}
                sessionId={sessionUser ? sessionUser._id : ""}
                messageId={message._id}
                setMessages={setMessages}
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
