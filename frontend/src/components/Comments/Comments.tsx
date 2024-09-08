import axios, { AxiosResponse } from "axios";
import styles from "./Comments.module.css";
import { useEffect, useState } from "react";
import { User } from "../../user";
import SingleComment from "../SingleComment/SingleComment";
import noAvatar from "../../images/no-avatar.png";
import { FaPaperPlane } from "react-icons/fa";
import { useUser } from "../../context/UserContext";

type Props = {
  postId: string;
};

type Comment = {
  _id: string;
  userId: string;
  text: string;
};

const Comments = ({ postId }: Props) => {
  const [allComments, setAllComments] = useState<Comment[]>();
  const { sessionUser } = useUser();
  const [comment, setComment] = useState("");

  const getPostComments = async (postId: string) => {
    try {
      const response: AxiosResponse<Comment[]> = await axios.get(
        `http://localhost:5000/api/posts/comment/${postId}`
      );

      setAllComments(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response: AxiosResponse<Comment[]> = await axios.post(
        `http://localhost:5000/api/posts/comment/${postId}`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComment("");
      setAllComments(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPostComments(postId);
  }, []);

  console.log(comment);

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.formCom}>
          <img
            src={sessionUser?.avatar ? sessionUser.avatar : noAvatar}
            className={styles.avatar}
          />
          <form className={styles.form} onSubmit={submitComment}>
            <input
              type="text"
              placeholder="Ajouter un nouveau commentaire"
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit">
              <FaPaperPlane className={styles.btnIcon} />
            </button>
          </form>
        </div>
        {allComments?.map((comment, index) => {
          return (
            <SingleComment
              text={comment.text}
              userId={comment.userId}
              key={index}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Comments;
