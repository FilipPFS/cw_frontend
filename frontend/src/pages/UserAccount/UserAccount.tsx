import React, { useEffect, useState } from "react";
import styles from "./UserAccount.module.css";
import UserImages from "../../components/UserImages/UserImages";
import { User } from "../../components/SignlePost/SinglePost";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import Header from "../../components/Header/Header";
import UserInfo from "../../components/UserInfo/UserInfo";
import Posts, { Post } from "../../components/Posts/Posts";
import { useUser } from "../../context/UserContext";

type Props = {};

const UserAccount = (props: Props) => {
  const [user, setUser] = useState<User>();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const { userId } = useParams();
  const { sessionUser } = useUser();

  const getUser = async () => {
    try {
      const response: AxiosResponse<User> = await axios.get(
        `http://localhost:5000/api/users/${userId}`
      );

      setUser(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getUserPosts = async () => {
    try {
      const response: AxiosResponse<Post[]> = await axios.get(
        `http://localhost:5000/api/posts/${userId}`
      );

      setUserPosts(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUser();
    getUserPosts();
  }, []);

  const navigate = useNavigate();

  if (sessionUser?._id === userId) {
    navigate("/my-account");
  }

  return (
    <div className={styles.container}>
      <div className={styles.homeContainer}>
        {user && <UserImages user={user} isEditable={false} />}
        {user && (
          <UserInfo
            user={user}
            editable={false}
            session={sessionUser}
            setUser={setUser}
          />
        )}
        <Posts
          posts={userPosts}
          setPosts={setUserPosts}
          homePage={false}
          editable={false}
        />
      </div>
    </div>
  );
};

export default UserAccount;
