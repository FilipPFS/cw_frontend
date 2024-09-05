import React from "react";
import SinglePost from "../SignlePost/SinglePost";
import styles from "./Posts.module.css";
import axios, { AxiosResponse } from "axios";
import { useLocation, useParams } from "react-router-dom";

type Props = {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  homePage: boolean;
  editable: boolean;
};

export type Post = {
  _id: string;
  userId: string;
  content?: string;
  img?: string;
  likes: [{ userId: string; _id: string }];
  comments: { userId: string; text: string }[];
  createdAt: string;
};

const Posts = ({ posts, setPosts, homePage, editable }: Props) => {
  const location = useLocation();
  const { hash } = useLocation();
  const { userId } = useParams();

  const addLike = async (postId: string) => {
    const token = localStorage.getItem("token");

    try {
      const response: AxiosResponse<{
        posts: Post[];
        liked: Post[];
        userPosts: Post[];
      }> = await axios.post(`http://localhost:5000/api/posts/${postId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const singleUserPost = response.data.posts
        .filter((post: Post) => post.userId === userId)
        .sort(
          (a: Post, b: Post) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      if (location.pathname === "/") {
        setPosts(response.data.posts);
      } else if (hash === "#posts") {
        setPosts(response.data.userPosts);
      } else if (hash === "#likes") {
        setPosts(response.data.liked);
      } else if (location.pathname === `/user/${userId}`) {
        setPosts(singleUserPost);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (posts && posts.length === 0) {
    return (
      <div className={styles.noPosts}>
        <h4>Vous n'avez rien ici pour l'instant.</h4>
      </div>
    );
  }

  return (
    <div
      className={`${styles.postList} ${
        homePage ? styles.homePosts : styles.userPosts
      }`}
    >
      {posts &&
        posts.map((post) => {
          return (
            <SinglePost
              createdAt={post.createdAt}
              key={post._id}
              _id={post._id}
              userId={post.userId}
              content={post.content}
              img={post.img}
              likes={post.likes}
              comments={post.comments}
              addLike={addLike}
              homePage={homePage}
              editable={editable}
              setPosts={setPosts}
            />
          );
        })}
    </div>
  );
};

export default Posts;
