import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import styles from "./Event.module.css";
import axios, { AxiosResponse } from "axios";
import SingleEvent from "../../components/SingleEvent/SingleEvent";
import { User } from "../../components/SignlePost/SinglePost";
import { FaCalendarAlt } from "react-icons/fa";
import CreateEventModal from "../../components/EventModal/EventModal";
import { toast } from "react-toastify";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const deleteEvent = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      const response: AxiosResponse = await axios.delete(
        `http://localhost:5000/api/events/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setEvents!(response.data.updatedEvents);
        toast.success("Action was successful!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const subToEvent = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      const response: AxiosResponse = await axios.post(
        `http://localhost:5000/api/events/like/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response) {
        setEvents!(response.data.sortedEvents);
      }
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
      {isModalOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsModalOpen(false)}
        ></div>
      )}
      <div className={styles.mainContainer}>
        <div className={styles.eventHeader}>
          <h2 className={styles.title}>
            <FaCalendarAlt />
            Les événements
          </h2>
          <button onClick={() => setIsModalOpen(true)}>
            Créer un évènement
          </button>
        </div>
        {isModalOpen && (
          <CreateEventModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            setEvents={setEvents}
          />
        )}
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
                deleteEvent={deleteEvent}
                subToEvent={subToEvent}
                userPage={false}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Event;
