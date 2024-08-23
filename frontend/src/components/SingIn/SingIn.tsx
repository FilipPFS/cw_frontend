import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import styles from "./SingIn.module.css";
import logo from "../../images/logo.webp";
import axios from "axios";

interface FormData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

type Props = {};

const SignIn = (props: Props) => {
  const [selected, setSelected] = useState(false);

  const [loginData, setLoginData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    formType: "login" | "register"
  ) => {
    const { name, value } = e.target;

    if (formType === "login") {
      setLoginData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setRegisterData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        loginData
      );

      if (response) {
        localStorage.setItem("token", response.data.token);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegisterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        registerData
      );

      if (response) {
        setSelected(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.parent}>
      <div className={styles.container}>
        <div className={styles.imgContainer}>
          <img src={logo} alt="Logo" />
        </div>
        {!selected ? (
          <form className={styles.form} onSubmit={handleLoginSubmit}>
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) => handleChange(e, "login")}
            />
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={loginData.password}
              onChange={(e) => handleChange(e, "login")}
            />
            <button type="submit">Se connecter</button>
          </form>
        ) : (
          <form className={styles.form} onSubmit={handleRegisterSubmit}>
            <input
              type="text"
              name="firstName"
              placeholder="Nom"
              value={registerData.firstName}
              onChange={(e) => handleChange(e, "register")}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Prénom"
              value={registerData.lastName}
              onChange={(e) => handleChange(e, "register")}
            />
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={registerData.email}
              onChange={(e) => handleChange(e, "register")}
            />
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={registerData.password}
              onChange={(e) => handleChange(e, "register")}
            />
            <button type="submit">S'inscrire</button>
          </form>
        )}
        <div>
          {!selected ? (
            <span>
              Vous n'avez pas de compte?{" "}
              <Link to="/" onClick={() => setSelected(true)}>
                S'inscrire
              </Link>
            </span>
          ) : (
            <span>
              Vous avez un compte?{" "}
              <Link to="/" onClick={() => setSelected(false)}>
                Se connecter
              </Link>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
