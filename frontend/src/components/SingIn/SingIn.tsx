import React from "react";
import logo from "../../images/logo.webp";
import { Link } from "react-router-dom";

type Props = {};

const SingIn = (props: Props) => {
  return (
    <div>
      <div>
        <img src={logo} alt="Logo" />
      </div>
      <form>
        <input type="text" placeholder="Email" />
        <input type="password" placeholder="Mot de passe" />
        <button>Se connecter</button>
      </form>
      <div>
        <span>
          Vous n'avez pas de compte? <Link to={"/register"}>S'inscrire</Link>
        </span>
      </div>
    </div>
  );
};

export default SingIn;
