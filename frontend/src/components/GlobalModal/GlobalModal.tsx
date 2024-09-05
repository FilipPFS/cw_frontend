import { useState } from "react";
import styles from "./GlobalModal.module.css";

type Props = {
  open: boolean;
  question: string;
  validate: () => void;
  cancel: React.Dispatch<React.SetStateAction<boolean>>;
};

const GlobalModal = ({ question, validate, cancel, open }: Props) => {
  return (
    <>
      {open && (
        <div className={styles.overlay} onClick={() => cancel(false)}></div>
      )}
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <h2>{question}</h2>
          <section className={styles.btns}>
            <button onClick={validate}>Oui</button>
            <button onClick={() => cancel(false)}>Non</button>
          </section>
        </div>
      </div>
    </>
  );
};

export default GlobalModal;
