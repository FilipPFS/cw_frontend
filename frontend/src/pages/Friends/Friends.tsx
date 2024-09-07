import styles from "./Friends.module.css";
import Header from "../../components/Header/Header";
import { FaUserFriends } from "react-icons/fa";
import { User } from "../../components/SignlePost/SinglePost";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import EventParticipants from "../../components/EventParticipants/EventParticipants";
import { FriendRequest } from "../../components/UserInfo/UserInfo";
import { toast } from "react-toastify";

type Props = {};

const Friends = (props: Props) => {
  const [friends, setFriends] = useState<User[]>([]);
  const [userRequests, setUserRequests] = useState<FriendRequest[]>([]);
  const [myRequests, setMyReqests] = useState<FriendRequest[]>([]);

  const getFriends = async () => {
    const token = localStorage.getItem("token");
    try {
      const response: AxiosResponse<User[]> = await axios.get(
        "http://localhost:5000/api/users/friends",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setFriends(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getRequests = async () => {
    const token = localStorage.getItem("token");
    try {
      const response: AxiosResponse<{
        receivedRequest: FriendRequest[] | [];
        sendedRequests: FriendRequest[] | [];
      }> = await axios.get("http://localhost:5000/api/fr-request/session", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setUserRequests(response.data.receivedRequest);
        setMyReqests(response.data.sendedRequests);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const rejectRequest = async (requestId: string) => {
    const token = localStorage.getItem("token");
    try {
      const response: AxiosResponse<{
        userRequests: FriendRequest[] | [];
      }> = await axios.delete(
        `http://localhost:5000/api/fr-request/reject/${requestId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setUserRequests(response.data.userRequests);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const acceptFriendRequest = async (requestId: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `http://localhost:5000/api/fr-request/accept/${requestId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success("Demande d'ami accepté");
        setFriends(response.data.friends);
        setUserRequests(response.data.userRequests);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteFriend = async (userId: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/delete/${userId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        getFriends();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getFriends();
    getRequests();
  }, []);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.mainContainer}>
        <h2 className={styles.title}>
          <FaUserFriends />
          Mes amis
        </h2>
        <div className={styles.childContainer}>
          <section className={styles.reqSectionOne}>
            <h3 className={styles.sectionTitle}>Demandes d'ami recu</h3>
            {userRequests.length > 0 ? (
              <>
                {userRequests.map((userReq) => {
                  return (
                    <div key={userReq._id} className={styles.userRequest}>
                      <EventParticipants userId={userReq.senderId} />
                      <div className={styles.reqBtns}>
                        <button
                          onClick={() => acceptFriendRequest(userReq._id)}
                          className={styles.blue}
                        >
                          Accepter
                        </button>
                        <button
                          onClick={() => rejectRequest(userReq._id)}
                          className={styles.red}
                        >
                          Rejeter
                        </button>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className={styles.userRequest}>
                <p>Vous n'avez pas de nouvelles demande d'ami.</p>
              </div>
            )}
          </section>
          <section className={styles.reqSectionTwo}>
            <h3 className={styles.sectionTitle}>Demandes d'ami envoyés</h3>
            {myRequests.length > 0 ? (
              <>
                {myRequests.map((myReq) => {
                  return (
                    <div key={myReq._id} className={styles.myRequest}>
                      <EventParticipants userId={myReq.receiverId} />
                      <div>
                        <p>En attente de sa réponse</p>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className={styles.myRequest}>
                <p>Vous n'avez envoyé aucune demande pour le moment.</p>
              </div>
            )}
          </section>
        </div>
        <section className={styles.friendList}>
          <h3>Liste d'amis</h3>
          {friends.map((friend) => {
            return (
              <EventParticipants
                key={friend._id}
                userId={friend._id}
                friendPage={true}
                deleteFriend={deleteFriend}
              />
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default Friends;
