import { useEffect, useState } from "react";
import styles from "./Messages.module.css";
import Header from "../../components/Header/Header";
import axios, { AxiosResponse } from "axios";
import { Message } from "../Chat/Chat";
import MessageModal from "../../components/MessageModal/MessageModal";
import { FaEnvelope, FaRegEnvelope } from "react-icons/fa";

type Props = {};

const Messages = (props: Props) => {
  const [lastMessages, setLastMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem("token");
      try {
        const response: AxiosResponse<{ [key: string]: Message[] }> =
          await axios.get("http://localhost:5000/api/messages", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        const groupedMessages = response.data;

        const lastMessagesArray = Object.keys(groupedMessages).map((key) => {
          const messages = groupedMessages[key];
          return messages[messages.length - 1]; // Get the last message
        });

        setLastMessages(lastMessagesArray);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.homeContainer}>
        <h2 className={styles.title}>
          <FaRegEnvelope />
          Vos messages
        </h2>
        {lastMessages.map((message, index) => (
          <MessageModal
            key={index}
            senderId={message.senderId}
            receiverId={message.receiverId}
            content={message.content}
            date={message.date}
          />
        ))}
      </div>
    </div>
  );
};

export default Messages;
