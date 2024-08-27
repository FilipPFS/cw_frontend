import React, { useEffect, useState } from "react";
import { users } from "../../users";
import styles from "./SinglePost.module.css";
import { Post } from "../Posts/Posts";
import axios from "axios";
import noAvatar from "../../images/no-avatar.png";
import {
  FaChartArea,
  FaComment,
  FaRegThumbsUp,
  FaTh,
  FaThumbsUp,
} from "react-icons/fa";
import Comments from "../Comments/Comments";

type SinglePostProps = Post & { addLike: (postId: string) => void };

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar: string;
  banner: string;
  userPosts: [];
  likedPosts: string[];
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
  comments,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [viewComments, setViewComments] = useState(false);
  const [sessionsUser, setSessionUser] = useState<User>();

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");

      setUsers(response.data);
    } catch (err) {
      console.error(err);
    }
  };

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

  useEffect(() => {
    getUsers();
    getSessionUser();
  }, []);

  const user = users.find((user) => user._id === userId);

  if (!user) {
    return <div>User not found</div>; // Handle case where user is not found
  }

  const seeComments = () => {
    setViewComments((prevComments) => !prevComments);
  };

  const hasLiked = likes.some((like) => like.userId === sessionsUser?._id);

  console.log(hasLiked);

  return (
    <div className={styles.singlePost}>
      <div className={styles.userInfo}>
        <div className={styles.imgCtn}>
          <img
            src={user.avatar ? user.avatar : noAvatar}
            alt={`${user.firstName} ${user.lastName}`}
          />
        </div>
        <div>
          <h4>
            {user.firstName} {user.lastName}
          </h4>
        </div>
      </div>
      <div className={styles.content}>
        {content && <p>{content}</p>}
        {img && (
          <div className={styles.postImgCtn}>
            <img src={img} alt="post" className={styles.postImg} />
          </div>
        )}
        <div className={styles.reactions}>
          <div className={styles.reactionsLikes}>
            <span>{likes.length}</span>
            <span className={styles.likeBlock}>
              <FaThumbsUp className={styles.likeIcon} />
            </span>
          </div>
          <span>{comments.length} commentaire/s</span>
        </div>
        <div className={styles.comIcons}>
          <span onClick={() => addLike(_id)} className={styles.comIconBlock}>
            {hasLiked ? (
              <FaThumbsUp className={`${styles.comIcon} ${styles.liked}`} />
            ) : (
              <FaRegThumbsUp
                className={`${styles.comIcon} ${styles.notLiked}`}
              />
            )}
            <span className={`${hasLiked && styles.liked}`}>J'aime</span>
          </span>
          <span onClick={seeComments} className={styles.comIconBlock}>
            <FaComment className={styles.comIcon} />
            {""} Commenter
          </span>
        </div>
        {viewComments && <Comments postId={_id} />}
      </div>
    </div>
  );
};

export default SinglePost;
