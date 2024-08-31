import React, { useState } from "react";
import styles from "./ImageModal.module.css";
import grayBanner from "../../images/graybanner.webp";
import { User } from "../SignlePost/SinglePost";
import axios, { AxiosResponse } from "axios";

type Props = {
  avatar: boolean;
  element: string;
  setIsModalOpen: (value: React.SetStateAction<boolean>) => void;
  setOverlay: (value: React.SetStateAction<boolean>) => void;
};

const ImageModal = ({ element, setIsModalOpen, avatar, setOverlay }: Props) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const closeModal = () => {
    setIsModalOpen(false);
    setOverlay(false);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const uploadImageToCloudinary = async (base64Image: string) => {
    try {
      console.log("Transferring image", base64Image);
      const response: AxiosResponse<{ url: string }> = await axios.post(
        "http://localhost:5000/api/upload/avatar",
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

      if (selectedImage) {
        // Convert the image file to base64 before uploading
        const base64Image = await convertToBase64(selectedImage);
        imageUrl = await uploadImageToCloudinary(base64Image);
      }

      const finalPostContent = {
        img: imageUrl,
      };

      console.log("Data to send", finalPostContent);

      let api_url = "";

      if (avatar) {
        api_url = "http://localhost:5000/api/users/avatar";
      } else {
        api_url = "http://localhost:5000/api/users/banner";
      }

      const response: AxiosResponse<User> = await axios.post(
        api_url,
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
  console.log(element);

  return (
    <div
      className={`${styles.modal} ${
        avatar ? styles.avatarModal : styles.bannerModal
      }`}
    >
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={closeModal}>
          &times;
        </span>

        <label htmlFor="fileInput" className={styles.imagePreview}>
          <img
            src={previewImage || (element ? element : grayBanner)}
            alt="Preview"
            className={`${avatar ? styles.previewImage : styles.bannerPreview}`}
          />
        </label>

        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={styles.fileInput}
        />

        <button onClick={handleSubmit} className={styles.submitButton}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
