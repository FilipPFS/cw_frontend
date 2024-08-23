import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import React from "react";
import Home from "./Home/Home";
import Header from "../components/Header/Header";
import SingIn from "../components/SingIn/SingIn";
import Register from "./Register/Register";

type Props = {};

const AppRouter = (props: Props) => {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {token ? (
          <>
            <Route index element={<Home />} />
            {/* Other authenticated routes */}
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
