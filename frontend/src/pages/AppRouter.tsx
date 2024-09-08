import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import React, { useEffect, useState } from "react";
import Home from "./Home/Home";
import Header from "../components/Header/Header";
import SingIn from "../components/SingIn/SingIn";
import Register from "./Register/Register";
import MyAccount from "./MyAccount/MyAccount";
import UserAccout from "./UserAccount/UserAccount";
import UserAccount from "./UserAccount/UserAccount";
import Messages from "./Messages/Messages";
import Chat from "./Chat/Chat";
import Bible from "./Bible/Bible";
import Event from "./Event/Event";
import Friends from "./Friends/Friends";
import { User } from "../components/SignlePost/SinglePost";
import axios, { AxiosResponse } from "axios";

type Props = {};

const AppRouter = (props: Props) => {
  const token = localStorage.getItem("token");

  const [user, setUser] = useState<User>();

  const getSessionUser = async () => {
    const token = localStorage.getItem("token");

    try {
      const response: AxiosResponse<User> = await axios.get(
        "http://localhost:5000/api/users/session",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getSessionUser();
  }, []);

  return (
    <Router>
      <div className="mainContainer">
        <Header sessionUser={user} />
        <Routes>
          {token ? (
            <>
              <Route index element={<Home />} />
              <Route path="my-account" element={<MyAccount />} />
              <Route path="user/:userId" element={<UserAccount />} />
              <Route path="messages" element={<Messages />} />
              <Route path="messages/:userMsgId" element={<Chat />} />
              <Route path="bible" element={<Bible />} />
              <Route path="music" element={<Bible />} />
              <Route path="events" element={<Event />} />
              <Route path="friends" element={<Friends />} />
            </>
          ) : (
            <>
              <Route path="*" element={<SingIn />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;
