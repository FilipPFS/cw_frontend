import styles from "./Home.module.css";
import Header from "../../components/Header/Header";
import FormPost from "../../components/FormPost/FormPost";
import Posts from "../../components/Posts/Posts";
import BibleQuotes from "../../components/BibleQuotes/BibleQuotes";

type Props = {};

const Home: React.FC<Props> = () => {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.homeContainer}>
        <FormPost />
        <Posts />
      </div>
      <BibleQuotes />
    </div>
  );
};

export default Home;
