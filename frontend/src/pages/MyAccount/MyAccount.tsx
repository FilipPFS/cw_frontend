import { useEffect, useState } from "react";
import styles from "./MyAccount.module.css";
import Header from "../../components/Header/Header";
import { User } from "../../components/SignlePost/SinglePost";
import axios, { AxiosResponse } from "axios";
import UserImages from "../../components/UserImages/UserImages";
import UserInfo from "../../components/UserInfo/UserInfo";
import Posts, { Post } from "../../components/Posts/Posts";
import UserEvents from "../../components/UserEvents/UserEvents";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";

type Props = {};

const MyAccount = (props: Props) => {
  const { sessionUser, setSessionUser } = useUser();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [viewPosts, setViewPosts] = useState(true);
  const [viewEvents, setViewEvents] = useState(false);

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
    getSessionUserPosts();
    getLikedPosts();
  }, []);

  const handleEvents = () => {
    setViewEvents(true);
    setViewPosts(false);
  };

  const handlePosts = () => {
    setViewPosts(true);
    setViewEvents(false);
  };

  const handleLikes = () => {
    setViewPosts(false);
    setViewEvents(false);
  };

  return (
    <div className={styles.container}>
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
          <Link to="/my-account#posts">
            <button
              onClick={handlePosts}
              className={viewPosts ? styles.activeBtn : ""}
            >
              Mes posts
            </button>
          </Link>
          <Link to="/my-account#likes">
            <button
              onClick={handleLikes}
              className={!viewEvents && !viewPosts ? styles.activeBtn : ""}
            >
              Mes j'aimes
            </button>
          </Link>
          <button
            onClick={handleEvents}
            className={viewEvents ? styles.activeBtn : ""}
          >
            Mes évenements
          </button>
        </div>
        {!viewEvents && (
          <>
            {viewPosts ? (
              <>
                {userPosts && (
                  <Posts
                    posts={userPosts}
                    fetchPosts={getSessionUserPosts}
                    fetchLiked={getLikedPosts}
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
                    fetchPosts={getSessionUserPosts}
                    fetchLiked={getLikedPosts}
                    homePage={false}
                    editable={false}
                  />
                )}
              </>
            )}
          </>
        )}
        {viewEvents && <UserEvents user={sessionUser} />}
      </div>
    </div>
  );
};

export default MyAccount;
