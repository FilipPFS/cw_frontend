import React, { useEffect, useState } from "react";
import styles from "./SinglePost.module.css";
import { Post } from "../Posts/Posts";
import axios, { AxiosResponse } from "axios";
import noAvatar from "../../images/no-avatar.png";
import { FaComment, FaRegThumbsUp, FaThumbsUp, FaTrash } from "react-icons/fa";
import Comments from "../Comments/Comments";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import GlobalModal from "../GlobalModal/GlobalModal";

type SinglePostProps = Post & {
  addLike: (postId: string) => void;
  homePage: boolean;
  editable: boolean;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
};

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar: string;
  banner: string;
  description: string;
  userPosts: [];
  likedPosts: string[];
  userEvents: [];
  friends: string[];
};

const SinglePost: React.FC<SinglePostProps> = ({
  userId,
  _id,
  content,
  img,
  likes,
  addLike,
  comments,
  homePage,
  editable,
  setPosts,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [viewComments, setViewComments] = useState(false);
  const [sessionsUser, setSessionUser] = useState<User>();
  const [openModal, setOpenModal] = useState(false);

  const getUsers = async () => {
    try {
      const response: AxiosResponse<User[]> = await axios.get(
        "http://localhost:5000/api/users"
      );

      setUsers(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getSessionUser = async () => {
    const token = localStorage.getItem("token");

    try {
      const response: AxiosResponse<User> = await axios.get(
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

  const deletePost = async () => {
    const token = localStorage.getItem("token");
    try {
      const response: AxiosResponse<Post[]> = await axios.delete(
        `http://localhost:5000/api/posts/delete/${_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response) {
        setPosts(response.data);
        toast.success("Le post a été supprimé.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`${styles.singlePost} ${
        homePage ? styles.singleHomePost : styles.singleUserPost
      }`}
    >
      <div className={styles.informations}>
        <div className={styles.userInfo}>
          <div className={styles.imgCtn}>
            <img
              src={user.avatar ? user.avatar : noAvatar}
              alt={`${user.firstName} ${user.lastName}`}
            />
          </div>
          <div>
            <Link to={`/user/${userId}`}>
              <h4>
                {user.firstName} {user.lastName}
              </h4>
            </Link>
          </div>
        </div>
        {editable && (
          <span className={styles.trash} onClick={() => setOpenModal(true)}>
            <FaTrash className={styles.trashIcon} />
          </span>
        )}
        {openModal && (
          <GlobalModal
            open={openModal}
            question="Etes-vous sûr de vouloir supprimer ce post?"
            validate={deletePost}
            cancel={setOpenModal}
          />
        )}
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
