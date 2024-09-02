import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";

import { jwtDecode } from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../src/Redux/Slice/userSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const { exp } = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        if (exp > now) {
          dispatch(setCredentials({ accessToken: token }));
        } else {
          localStorage.removeItem("accessToken");
        }
      } catch (error) {
        console.error("Invalid token:", error.message);
        localStorage.removeItem("accessToken");
      }
    }
  }, [dispatch]);

  const user = useSelector((state) => state.user);
  console.log("Redux State:", user); // Log toàn bộ state

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
