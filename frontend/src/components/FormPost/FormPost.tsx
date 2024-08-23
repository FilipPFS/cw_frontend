import React, { useState, useRef } from "react";
import axios from "axios";
import { FaImage, FaCalendar } from "react-icons/fa";
import styles from "./FormPost.module.css";
import CreateEventModal from "../EventModal/EventModal";
import noAvatar from "../../images/no-avatar.png";

type Props = {};

const FormPost = (props: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [postContent, setPostContent] = useState({ content: "", img: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInput = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setPostContent((prevState) => ({
          ...prevState,
          img: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent({ ...postContent, content: event.target.value });
  };

  const uploadImageToCloudinary = async (base64Image: string) => {
    try {
      console.log("Transfering image", base64Image);
      const response = await axios.post(
        "http://localhost:5000/api/upload/post",
        {
          img: base64Image,
        }
      );
      console.log(response.data.url);

      return response.data.url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return null;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      let imageUrl = null;

      const token = localStorage.getItem("token");

      if (postContent.img) {
        imageUrl = await uploadImageToCloudinary(postContent.img);
      }

      const finalPostContent = {
        content: postContent.content,
        img: imageUrl,
      };

      console.log("Data to send", finalPostContent);

      const response = await axios.post(
        "http://localhost:5000/api/posts",
        finalPostContent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response) {
        window.location.reload();
      }

      console.log("Post submitted:", finalPostContent);
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  return (
    <div className={styles.postContainer}>
      <div className={styles.userImgCtn}>
        <img src={noAvatar} alt="user logo" />
      </div>
      <form className={styles.formPost} onSubmit={handleSubmit}>
        <div className={styles.textCtn}>
          <textarea
            ref={textareaRef}
            onInput={handleInput}
            placeholder="Commencer un post..."
            value={postContent.content}
            onChange={handleTextChange}
            style={{
              overflowY: "hidden",
              resize: "none",
            }}
          />
        </div>
        {imageSrc && (
          <div className={styles.imagePreview}>
            <img src={imageSrc} alt="Uploaded preview" />
            <span
              onClick={() => {
                setImageSrc(null);
                setPostContent((prevState) => ({ ...prevState, img: "" }));
              }}
            >
              X
            </span>
          </div>
        )}
        <div className={styles.actions}>
          <div className={styles.eventIcons}>
            <span
              onClick={handleImageClick}
              style={{ cursor: "pointer" }}
              className={styles.iconCtn}
            >
              <FaImage className={styles.icon} />
            </span>
            <span onClick={() => setIsModalOpen(true)}>
              <FaCalendar className={styles.icon} />
            </span>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleImageUpload}
          />
          <button type="submit" className={styles.btnSubmit}>
            Publier
          </button>
        </div>
      </form>
      {isModalOpen && (
        <CreateEventModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
      {isModalOpen && <div className={styles.overlay}></div>}
    </div>
  );
};

export default FormPost;
