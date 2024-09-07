import { useState, useEffect, SetStateAction } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { User } from "../SignlePost/SinglePost";
import { DataRequest } from "../UserInfo/UserInfo";

type Props = {
  user: User;
  userId: string;
  sessionId: string | undefined;
  setUser: React.Dispatch<SetStateAction<User | undefined>> | undefined;
};

const FriendRequest = ({ userId, sessionId, setUser, user }: Props) => {
  const [friendRequestSent, setFriendRequestSent] = useState<DataRequest>();

  const token = localStorage.getItem("token");

  const checkFriendRequest = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/fr-request/check/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setFriendRequestSent(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const acceptFriendRequest = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/fr-request/accept/${friendRequestSent?.friendRequest._id}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setUser?.(response.data.secondUser);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendFriendRequest = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/fr-request/new/${userId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        toast("Demande d'ami envoyé");
        checkFriendRequest();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    checkFriendRequest();
  }, []);

  const isFriend = user.friends.find((friend) => friend === sessionId);

  return (
    <>
      {isFriend ? (
        <p>Ami(e)</p>
      ) : (
        <>
          {friendRequestSent ? (
            friendRequestSent.sentRequest ? (
              <button>Demande d'ami envoyé</button>
            ) : (
              <button onClick={acceptFriendRequest}>Accepter en ami</button>
            )
          ) : (
            <button onClick={sendFriendRequest}>Demander en ami</button>
          )}
        </>
      )}
    </>
  );
};

export default FriendRequest;
