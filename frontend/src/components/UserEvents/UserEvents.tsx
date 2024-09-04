import React, { useEffect, useState } from "react";
import { type Event } from "../../pages/Event/Event";
import axios, { AxiosResponse } from "axios";
import SingleEvent from "../SingleEvent/SingleEvent";
import { type User } from "../SignlePost/SinglePost";
import styles from "./UserEvents.module.css";

type Props = {
  user: User | undefined;
};

const UserEvents = ({ user }: Props) => {
  const [hostedEvents, setHostedEvents] = useState<Event[]>([]);
  const [participantEvents, setParticipantEvents] = useState<Event[]>([]);

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
        setHostedEvents(response.data.hostedEvents);
        setParticipantEvents(response.data.participantEvents);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getMyEvents = async () => {
    const token = localStorage.getItem("token");

    try {
      const response: AxiosResponse<{
        hostedEvents: Event[];
        participantEvents: Event[];
      }> = await axios.get("http://localhost:5000/api/events/session", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setHostedEvents(response.data.hostedEvents);
        setParticipantEvents(response.data.participantEvents);
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
        setHostedEvents(response.data.newHostedEvents);
        setParticipantEvents(response.data.participantEvents);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMyEvents();
  }, []);

  return (
    <div className={styles.container}>
      <section className={styles.eventsContainer}>
        <h2>J'organise</h2>
        {hostedEvents.map((event) => {
          return (
            <SingleEvent
              {...event}
              sessionUser={user}
              deleteEvent={deleteEvent}
              subToEvent={subToEvent}
              userPage={true}
            />
          );
        })}
      </section>
      <section className={styles.eventsContainer}>
        <h2>Je participe</h2>
        {participantEvents.map((event) => {
          return (
            <SingleEvent
              {...event}
              sessionUser={user}
              deleteEvent={deleteEvent}
              subToEvent={subToEvent}
              userPage={true}
            />
          );
        })}
      </section>
    </div>
  );
};

export default UserEvents;
