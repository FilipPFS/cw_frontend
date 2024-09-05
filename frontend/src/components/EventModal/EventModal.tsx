import React, { type Dispatch, type SetStateAction, useState } from "react";
import styles from "./EventModal.module.css";
import axios, { AxiosResponse } from "axios";
import { FaImage } from "react-icons/fa";
import { type Event } from "../../pages/Event/Event";
import { toast } from "react-toastify";

interface EventData {
  title: string;
  cover: File | null;
  coverPreview: string | null;
  description: string;
}

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  setEvents?: Dispatch<SetStateAction<Event[]>>;
}

const MAX_FILE_SIZE_MB = 4;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const CreateEventModal: React.FC<Props> = ({
  isModalOpen,
  setIsModalOpen,
  setEvents,
}) => {
  const [eventData, setEventData] = useState<EventData>({
    title: "",
    cover: null,
    coverPreview: null,
    description: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "cover" && files && files[0]) {
      const file = files[0];

      if (file.size > MAX_FILE_SIZE_BYTES) {
        alert(`Le fichier ne doit pas plus de ${MAX_FILE_SIZE_MB}MB`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setEventData((prevState) => ({
          ...prevState,
          cover: file,
          coverPreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setEventData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const uploadImageToCloudinary = async (base64Image: string) => {
    try {
      const response: AxiosResponse<{ url: string }> = await axios.post(
        "http://localhost:5000/api/upload/event",
        {
          img: base64Image,
        }
      );

      return response.data.url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    try {
      let imageUrl = "";

      if (eventData.coverPreview) {
        const uploadedImageUrl = await uploadImageToCloudinary(
          eventData.coverPreview
        );
        imageUrl = uploadedImageUrl ?? ""; // Fallback to empty string if null
      }

      const eventPayload = {
        title: eventData.title,
        coverImg: imageUrl,
        description: eventData.description,
      };

      const response: AxiosResponse<Event[]> = await axios.post(
        "http://localhost:5000/api/events",
        eventPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onClose();
      if (response.status === 201) {
        setEvents?.(response.data);
        toast.success("Ajouté avec succès.", {
          autoClose: 1500,
        });
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const onClose = () => {
    setEventData({
      title: "",
      cover: null,
      coverPreview: null,
      description: "",
    });
    setIsModalOpen(false);
  };

  const deleteImg = () => {
    setEventData((prevState) => ({
      ...prevState,
      cover: null,
      coverPreview: null,
    }));
  };

  return isModalOpen ? (
    <div className={styles.modal}>
      <h2>Créer ton évenement</h2>
      <input
        type="text"
        name="title"
        placeholder="Event Name"
        value={eventData.title}
        onChange={handleInputChange}
      />
      <input
        type="file"
        id="cover"
        name="cover"
        accept="image/*"
        onChange={handleInputChange}
        className={styles.hiddenInput}
      />
      {!eventData.coverPreview && (
        <label htmlFor="cover" className={styles.customUpload}>
          <FaImage className={styles.iconImg} />
          <small>4MB Maximum</small>
        </label>
      )}
      {eventData.coverPreview && (
        <>
          <img
            src={eventData.coverPreview}
            alt="Event Cover Preview"
            className={styles.imagePreview}
          />
          <span onClick={deleteImg}>X</span>
        </>
      )}
      <input
        type="text"
        name="description"
        placeholder="Description..."
        value={eventData.description}
        onChange={handleInputChange}
        className={styles.desc}
      />
      <button onClick={handleSubmit}>Créer l'évenement</button>
      <button onClick={onClose}>Annuler</button>
    </div>
  ) : null;
};

export default CreateEventModal;
