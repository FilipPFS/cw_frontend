import React, { useEffect, useState } from "react";
import { users } from "../../users";
import styles from "./SinglePost.module.css";
import { Post } from "../Posts/Posts";
import axios from "axios";
import noAvatar from "../../images/no-avatar.png";
import { FaChartArea, FaComment, FaThumbsUp } from "react-icons/fa";

type SinglePostProps = Post & { addLike: (postId: string) => void };

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar: string;
  userPosts: [];
  likedPosts: [];
  userEvents: [];
  friends: [];
};

const SinglePost: React.FC<SinglePostProps> = ({
  userId,
  _id,
  content,
  img,
  likes,
  addLike,
}) => {
  const [users, setUsers] = useState<User[]>([]);

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");

      setUsers(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const user = users.find((user) => user._id === userId);

  if (!user) {
    return <div>User not found</div>; // Handle case where user is not found
  }

  return (
    <div className={styles.singlePost}>
      <div className={styles.imgCtn}>
        <img
          src={user.avatar ? user.avatar : noAvatar}
          alt={`${user.firstName} ${user.lastName}`}
        />
      </div>
      <div className={styles.content}>
        <h4>
          {user.firstName} {user.lastName}
        </h4>
        {content && <p>{content}</p>}
        {img && (
          <div className={styles.postImgCtn}>
            <img src={img} alt="post" className={styles.postImg} />
          </div>
        )}
        <div className={styles.comIcons}>
          {likes.length}
          <FaThumbsUp onClick={() => addLike(_id)} className={styles.comIcon} />
          <FaComment className={styles.comIcon} />
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
