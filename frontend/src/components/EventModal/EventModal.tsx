import React, { useState } from "react";
import styles from "./EventModal.module.css";

interface EventData {
  name: string;
  cover: File | null;
  coverPreview: string | null;
  startDate: string;
  endDate: string;
  description: string;
}

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const CreateEventModal: React.FC<Props> = ({ isModalOpen, setIsModalOpen }) => {
  const [eventData, setEventData] = useState<EventData>({
    name: "",
    cover: null,
    coverPreview: null,
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "cover" && files && files[0]) {
      const file = files[0];
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

  const handleSubmit = () => {
    console.log(eventData);
    onClose(); // Close the modal after creation
  };

  const onClose = () => {
    setEventData({
      name: "",
      cover: null,
      coverPreview: null,
      startDate: "",
      endDate: "",
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
        name="name"
        placeholder="Event Name"
        value={eventData.name}
        onChange={handleInputChange}
      />
      <input
        type="file"
        name="cover"
        accept="image/*"
        onChange={handleInputChange}
      />
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
        type="date"
        name="startDate"
        value={eventData.startDate}
        onChange={handleInputChange}
      />
      <input
        type="date"
        name="endDate"
        value={eventData.endDate}
        onChange={handleInputChange}
      />
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
