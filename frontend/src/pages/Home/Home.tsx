import React from "react";
import SingIn from "../../components/SingIn/SingIn";
import styles from "./Home.module.css";
import Header from "../../components/Header/Header";

type Props = {};

const Home = (props: Props) => {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.homeContainer}>Home</div>
    </div>
  );
};

export default Home;
