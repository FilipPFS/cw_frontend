import { useEffect, useState } from "react";
import styles from "./MyAccount.module.css";
import Header from "../../components/Header/Header";
import { User } from "../../components/SignlePost/SinglePost";
import axios, { AxiosResponse } from "axios";
import UserImages from "../../components/UserImages/UserImages";
import UserInfo from "../../components/UserInfo/UserInfo";
import Posts, { Post } from "../../components/Posts/Posts";

type Props = {};

const MyAccount = (props: Props) => {
  const [sessionUser, setSessionUser] = useState<User>();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [viewPosts, setViewPosts] = useState(true);

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

  const getSessionUserPosts = async () => {
    const token = localStorage.getItem("token");

    try {
      const response: AxiosResponse<Post[]> = await axios.get(
        `http://localhost:5000/api/posts/post`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserPosts(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getLikedPosts = async () => {
    const token = localStorage.getItem("token");

    try {
      const response: AxiosResponse<Post[]> = await axios.get(
        `http://localhost:5000/api/posts/likedPosts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLikedPosts(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getSessionUser();
    getSessionUserPosts();
    getLikedPosts();
  }, []);

  console.log("Liked posts", likedPosts);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.homeContainer}>
        {sessionUser && <UserImages user={sessionUser} isEditable={true} />}
        {sessionUser && (
          <UserInfo
            user={sessionUser}
            editable={true}
            setSessionUser={setSessionUser}
          />
        )}
        <div className={styles.btns}>
          <button
            onClick={() => setViewPosts(true)}
            className={viewPosts ? styles.activeBtn : ""}
          >
            Mes posts
          </button>
          <button
            onClick={() => setViewPosts(false)}
            className={!viewPosts ? styles.activeBtn : ""}
          >
            Mes j'aimes
          </button>
        </div>
        {viewPosts ? (
          <>
            {userPosts && (
              <Posts
                posts={userPosts}
                setPosts={setUserPosts}
                homePage={false}
                editable={true}
              />
            )}
          </>
        ) : (
          <>
            {likedPosts && (
              <Posts
                posts={likedPosts}
                setPosts={setLikedPosts}
                homePage={false}
                editable={false}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyAccount;
