import React, { useEffect, useState } from "react";
import SinglePost from "../SignlePost/SinglePost";
import styles from "./Posts.module.css";
import axios from "axios";

type Props = {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
};

export type Post = {
  _id: string;
  userId: string;
  content?: string;
  img?: string;
  likes: [{ userId: string; _id: string }];
  comments: { userId: string; text: string }[];
};

const Posts = ({ posts, setPosts }: Props) => {
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
