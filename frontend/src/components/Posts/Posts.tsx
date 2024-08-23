import React, { useEffect, useState } from "react";
import SinglePost from "../SignlePost/SinglePost";
import styles from "./Posts.module.css";
import axios from "axios";

type Props = {};

export type Post = {
  _id: string;
  userId: string;
  content?: string;
  img?: string;
  likes: string[];
  comments: { userId: string; text: string }[];
};

const Posts = (props: Props) => {
  const [posts, setPosts] = useState<Post[]>([]);

  const getPosts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/posts");
      setPosts(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addLike = async (postId: string) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `http://localhost:5000/api/posts/${postId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  console.log(posts);

  return (
    <div className={styles.postList}>
      {posts.map((post) => {
        return (
          <SinglePost
            key={post._id}
            _id={post._id}
            userId={post.userId}
            content={post.content}
            img={post.img}
            likes={post.likes}
            comments={post.comments}
            addLike={addLike}
          />
        );
      })}
    </div>
  );
};

export default Posts;
