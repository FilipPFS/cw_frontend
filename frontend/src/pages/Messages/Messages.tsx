import React from "react";
import styles from "./Messages.module.css";
import Header from "../../components/Header/Header";

type Props = {};

const Messages = (props: Props) => {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.homeContainer}>
        <h1>Messages</h1>
      </div>
    </div>
  );
};

export default Messages;
