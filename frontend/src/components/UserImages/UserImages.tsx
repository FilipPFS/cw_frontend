import React, { useState } from "react";
import { User } from "../SignlePost/SinglePost";
import grayBanner from "../../images/graybanner.webp";
import noAvatar from "../../images/no-avatar.png";
import styles from "./UserImages.module.css";
import { isEditable } from "@testing-library/user-event/dist/utils";
import { FaPen } from "react-icons/fa";
import ImageModal from "../ImageModal/ImageModal";

type Props = {
  user: User;
  isEditable: boolean;
};

const UserImages = ({ user, isEditable }: Props) => {
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [clickedBanner, setClickedBanner] = useState(false);
  const [clickedAvatar, setClickedAvatar] = useState(false);

  const handleClickedBanner = () => {
    setClickedBanner((prevBanner) => !prevBanner);
    setOverlay((prevOverlay) => !prevOverlay);
  };

  const handleClickedAvatar = () => {
    setClickedAvatar((prevAsetClickedAvatar) => !prevAsetClickedAvatar);
    setOverlay((prevOverlay) => !prevOverlay);
  };

  const closeOverlay = () => {
    setClickedBanner(false);
    setClickedAvatar(false);
    setOverlay(false);
    setIsBannerModalOpen(false);
    setIsAvatarModalOpen(false);
  };

  const openBannerModal = () => {
    setOverlay(true);
    setIsBannerModalOpen(true);
  };

  const openAvatarModal = () => {
    setOverlay(true);
    setIsAvatarModalOpen(true);
  };

  return (
    <div className={styles.container}>
      {overlay && <div onClick={closeOverlay} className={styles.overlay}></div>}
      {isEditable ? (
        <div className={styles.imgContainer}>
          <div className={styles.bannerCtn}>
            <img
              src={user.banner ? user.banner : grayBanner}
              className={styles.banner}
              onClick={handleClickedBanner}
            />
            {clickedBanner && (
              <img
                src={user.banner ? user.banner : grayBanner}
                className={styles.clickedBanner}
              />
            )}
            {isBannerModalOpen && (
              <ImageModal
                avatar={false}
                element={user.banner}
                setIsModalOpen={setIsBannerModalOpen}
                setOverlay={setOverlay}
              />
            )}
            <span className={styles.bannerIcon} onClick={openBannerModal}>
              <FaPen />
            </span>
          </div>
          <div className={styles.avatarCtn}>
            <img
              src={user.avatar ? user.avatar : noAvatar}
              className={styles.avatar}
              onClick={handleClickedAvatar}
            />
            {clickedAvatar && (
              <img
                src={user.avatar ? user.avatar : noAvatar}
                className={styles.clickedAvatar}
              />
            )}
            {isAvatarModalOpen && (
              <ImageModal
                element={user.avatar}
                setIsModalOpen={setIsAvatarModalOpen}
                avatar={true}
                setOverlay={setOverlay}
              />
            )}
            <span className={styles.avatarIcon} onClick={openAvatarModal}>
              <FaPen />
            </span>
          </div>
        </div>
      ) : (
        <>
          {overlay && (
            <div onClick={closeOverlay} className={styles.overlay}></div>
          )}
          <div className={styles.imgContainer}>
            <div className={styles.bannerCtn}>
              <img
                src={user.banner ? user.banner : grayBanner}
                className={styles.banner}
                onClick={handleClickedBanner}
              />
              {clickedBanner && (
                <img
                  src={user.banner ? user.banner : grayBanner}
                  className={styles.clickedBanner}
                />
              )}
            </div>
            <div className={styles.avatarCtn}>
              <img
                src={user.avatar ? user.avatar : noAvatar}
                className={styles.avatar}
                onClick={handleClickedAvatar}
              />
              {clickedAvatar && (
                <img
                  src={user.avatar ? user.avatar : noAvatar}
                  className={styles.clickedAvatar}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserImages;
