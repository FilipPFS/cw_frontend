import { useEffect, useState } from "react";
import { type Event } from "../../pages/Event/Event";
import styles from "./SingleEvent.module.css";
import { type User } from "../SignlePost/SinglePost";
import axios, { AxiosResponse } from "axios";
import { Link } from "react-router-dom";
import noAvatar from "../../images/no-avatar.png";
import { FaEye, FaTrash, FaWindowClose } from "react-icons/fa";
import EventParticipants from "../EventParticipants/EventParticipants";

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
  const [eventModal, setEventModal] = useState(false);

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

  const deleteEvent = async () => {
    const token = localStorage.getItem("token");
    try {
      const response: AxiosResponse<Event[]> = await axios.delete(
        `http://localhost:5000/api/events/${_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setEvents(response.data);
      }
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
      {eventModal && (
        <div
          onClick={() => setEventModal(false)}
          className={styles.overlay}
        ></div>
      )}
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
          <Link
            to={
              sessionUser?._id === hostId ? "/my-account" : `/user/${user?._id}`
            }
          >
            {sessionUser?._id === hostId ? (
              "Vous"
            ) : (
              <>
                {user?.firstName} {user?.lastName}
              </>
            )}
          </Link>
        </span>
        {sessionUser && (
          <>
            {sessionUser?._id === hostId && (
              <button onClick={deleteEvent} className={styles.eventBtn}>
                <FaTrash />
                <span>Supprimer l'événement</span>
              </button>
            )}
            {sessionUser._id !== hostId ? (
              <button
                disabled={sessionUser._id === hostId}
                onClick={subToEvent}
                className={styles.eventBtn}
              >
                {subbed ? "Abonné" : "Participer"}
              </button>
            ) : (
              <button
                className={styles.eventBtn}
                onClick={() => setEventModal(true)}
              >
                <FaEye />
                <span>Voir les participants</span>
              </button>
            )}
          </>
        )}
      </div>
      {eventModal && (
        <section className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Les participants de votre évenement</h3>
            <FaWindowClose
              onClick={() => setEventModal(false)}
              className={styles.modalIcon}
            />
            {participants.length > 0 ? (
              <>
                {participants.map((participant) => {
                  return (
                    <EventParticipants
                      key={participant.userId}
                      userId={participant.userId}
                    />
                  );
                })}
              </>
            ) : (
              <p>
                Vous n'avez toujours pas des participants sur cet évenement.
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default SingleEvent;
