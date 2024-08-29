import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import React from "react";
import Home from "./Home/Home";
import Header from "../components/Header/Header";
import SingIn from "../components/SingIn/SingIn";
import Register from "./Register/Register";
import MyAccount from "./MyAccount/MyAccount";
import UserAccout from "./UserAccount/UserAccount";
import UserAccount from "./UserAccount/UserAccount";
import Messages from "./Messages/Messages";
import Chat from "./Chat/Chat";

type Props = {};

const AppRouter = (props: Props) => {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {token ? (
          <>
            <Route index element={<Home />} />
            <Route path="my-account" element={<MyAccount />} />
            <Route path="user/:userId" element={<UserAccount />} />
            <Route path="messages" element={<Messages />} />
            <Route path="messages/:userId" element={<Chat />} />
          </>
        ) : (
          <>
            <Route path="*" element={<SingIn />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default AppRouter;
