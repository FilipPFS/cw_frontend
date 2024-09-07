import styles from "./UserInfo.module.css";
import { User } from "../SignlePost/SinglePost";
import { FaPen } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import FriendRequest from "../UserFriend/UserFriend";

type Props = {
  editable: boolean;
  user: User;
  session?: User;
  setSessionUser?: React.Dispatch<React.SetStateAction<User | undefined>>;
  setUser?: React.Dispatch<React.SetStateAction<User | undefined>>;
};

type UserInfos = {
  firstName: string;
  lastName: string;
  description: string;
};

export type FriendRequest = {
  _id: string;
  senderId: string;
  receiverId: string;
  accepted: boolean;
};

export type DataRequest = {
  sentRequest: boolean;
  friendRequest: FriendRequest;
};

const UserInfo = ({
  user,
  editable,
  setSessionUser,
  session,
  setUser,
}: Props) => {
  const [modal, setModal] = useState(false);
  const [userInfos, setUserInfos] = useState<UserInfos>({
    firstName: "",
    lastName: "",
    description: "",
  });

  const openModal = () => {
    setModal(true);
    setUserInfos({
      firstName: user.firstName,
      lastName: user.lastName,
      description: user.description,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfos({
      ...userInfos,
      [name]: value,
    });
  };

  const closeModal = () => {
    setModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response: AxiosResponse<User> = await axios.put(
        "http://localhost:5000/api/users/personal-infos",
        userInfos,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSessionUser!(response.data);
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {modal && <div className={styles.overlay} onClick={closeModal}></div>}
      <div className={styles.container}>
        <div className={styles.edit}>
          <div className={styles.username}>
            <h2>
              {user.firstName} {user.lastName}
            </h2>
            {!editable && (
              <>
                <FriendRequest
                  user={user}
                  userId={user._id}
                  sessionId={session?._id}
                  setUser={setUser}
                />
                <Link to={`/messages/${user._id}`}>
                  <button>Message</button>
                </Link>
              </>
            )}
          </div>
          <p>{user.description}</p>
          <span>{user.friends.length} amis</span>
        </div>
        {editable && (
          <span onClick={openModal}>
            <FaPen />
          </span>
        )}
        {modal && (
          <div className={styles.modal}>
            <form onSubmit={handleSubmit}>
              <div className={styles.labels}>
                <section className={styles.labelSection}>
                  <label>Prénom</label>
                  <input
                    type="text"
                    placeholder="Votre prénom"
                    name="firstName"
                    onChange={handleChange}
                    value={userInfos.firstName}
                  />
                </section>
                <section className={styles.labelSection}>
                  <label>Nom</label>
                  <input
                    type="text"
                    placeholder="Votre nom"
                    name="lastName"
                    onChange={handleChange}
                    value={userInfos.lastName}
                  />
                </section>
              </div>
              <section className={styles.labelSection}>
                <label>Descripttion</label>
                <input
                  type="text"
                  placeholder="Votre descritpion"
                  name="description"
                  onChange={handleChange}
                  value={userInfos.description}
                />
              </section>
              <div className={styles.buttons}>
                <button onClick={closeModal}>Annuler</button>
                <button type="submit">Valider</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
