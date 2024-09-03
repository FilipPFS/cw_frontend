import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import styles from "./Event.module.css";
import axios, { AxiosResponse } from "axios";
import SingleEvent from "../../components/SingleEvent/SingleEvent";
import { User } from "../../components/SignlePost/SinglePost";

type Props = {};

export type Event = {
  _id: string;
  hostId: string;
  title: string;
  description: string;
  coverImg: string;
  participants: { userId: string }[];
  createdAt: string;
};

const Event = (props: Props) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [sessionUser, setSessionUser] = useState<User>();

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

  const getEvents = async () => {
    const token = localStorage.getItem("token");
    try {
      const response: AxiosResponse<Event[]> = await axios.get(
        "http://localhost:5000/api/events",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response) {
        setEvents(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getEvents();
    getSessionUser();
  }, []);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.mainContainer}>
        <h2>Les événements</h2>
        <div className={styles.events}>
          {events.map((event) => {
            return (
              <SingleEvent
                key={event._id}
                _id={event._id}
                hostId={event.hostId}
                title={event.title}
                description={event.description}
                coverImg={event.coverImg}
                participants={event.participants}
                createdAt={event.createdAt}
                setEvents={setEvents}
                sessionUser={sessionUser}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Event;
