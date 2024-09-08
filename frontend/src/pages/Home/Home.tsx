import styles from "./Home.module.css";
import Header from "../../components/Header/Header";
import FormPost from "../../components/FormPost/FormPost";
import Posts, { Post } from "../../components/Posts/Posts";
import BibleQuotes from "../../components/BibleQuotes/BibleQuotes";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

type Props = {};

const Home: React.FC<Props> = () => {
  const token = localStorage.getItem("token");
  const [posts, setPosts] = useState<Post[]>([]);
  const [friendsPosts, setFriendsPosts] = useState<Post[]>([]);
  const [classicPosts, setClassicPosts] = useState(true);

  const getPosts = async () => {
    try {
      const response: AxiosResponse<Post[]> = await axios.get(
        "http://localhost:5000/api/posts",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setPosts(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getFriendsPosts = async () => {
    try {
      const response: AxiosResponse<Post[]> = await axios.get(
        "http://localhost:5000/api/posts/friends",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setFriendsPosts(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPosts();
    getFriendsPosts();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.homeContainer}>
        <div className={styles.homePosts}>
          <FormPost setPosts={setPosts} />
          <div className={styles.buttons}>
            <button
              onClick={() => {
                setClassicPosts(true);
              }}
              className={classicPosts ? styles.active : ""}
            >
              Pour vous
            </button>
            <button
              onClick={() => {
                setClassicPosts(false);
              }}
              className={!classicPosts ? styles.active : ""}
            >
              Amis uniquement
            </button>
          </div>
          <Posts
            fetchPosts={getPosts}
            fetchFriendPosts={getFriendsPosts}
            posts={classicPosts ? posts : friendsPosts}
            setPosts={setPosts}
            homePage={true}
            editable={false}
          />
        </div>
        <BibleQuotes />
      </div>
    </div>
  );
};

export default Home;
