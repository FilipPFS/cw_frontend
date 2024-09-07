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

  const getPosts = async () => {
    try {
      const response: AxiosResponse<Post[]> = await axios.get(
        "http://localhost:5000/api/posts",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.homeContainer}>
        <div className={styles.homePosts}>
          <FormPost />
          <Posts
            fetchPosts={getPosts}
            posts={posts}
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
