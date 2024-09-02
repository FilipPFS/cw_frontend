import { useEffect, useState } from "react";
import { type Event } from "../../pages/Event/Event";
import styles from "./SingleEvent.module.css";
import { type User } from "../SignlePost/SinglePost";
import axios, { AxiosResponse } from "axios";
import { Link } from "react-router-dom";
import noAvatar from "../../images/no-avatar.png";

type Props = Event & {
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  sessionUser: User | undefined;
};

const SingleEvent = ({
  _id,
  hostId,
  coverImg,
  title,
  description,
  participants,
  setEvents,
  sessionUser,
}: Props) => {
  const [user, setUser] = useState<User>();

  const getUser = async () => {
    try {
      const response: AxiosResponse<User> = await axios.get(
        `http://localhost:5000/api/users/${hostId}`
      );

      setUser(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const subToEvent = async () => {
    const token = localStorage.getItem("token");
    try {
      const response: AxiosResponse<Event[]> = await axios.post(
        `http://localhost:5000/api/events/like/${_id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response) {
        setEvents(response.data);
        console.log("Subsribed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const subbed = participants.find((user) => user.userId === sessionUser?._id);

  return (
    <div className={styles.container}>
      <div className={styles.imgContainer}>
        <img src={coverImg} />
      </div>
      <div className={styles.infoContainer}>
        <h4>Titre: {title}</h4>
        <p>Description: {description}</p>
        <span className={styles.userName}>
          Hôte:{" "}
          <img
            src={user?.avatar ? user.avatar : noAvatar}
            className={styles.avatar}
          />
          <Link to={`/user/${user?._id}`}>
            {user?.firstName} {user?.lastName}
          </Link>
        </span>
        {sessionUser && (
          <button disabled={sessionUser._id === hostId} onClick={subToEvent}>
            {subbed ? "Abonné" : "Participer"}
          </button>
        )}
      </div>
    </div>
  );
};

export default SingleEvent;
