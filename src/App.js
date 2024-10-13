import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import User from "./components/User/User";
import Store from "./components/Store/Store";
import Overview from "./components/Overview/Overview";
import Cookies from "js-cookie";
import Order from "./components/Order/Order";
import Product from "./components/Product/Product";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../src/Redux/Slice/userSlice";

const App = () => {
  const dispatch = useDispatch();

  // Lấy token từ cookie
  const isLoggedIn = Cookies.get("accessToken");

  useEffect(() => {
    // Kiểm tra xem có thông tin lưu trữ trong Cookies hay không và khôi phục lại Redux store
    const accessToken = Cookies.get("accessToken") || localStorage.getItem("accessToken");
    const userInfo = Cookies.get("userInfo") ? JSON.parse(Cookies.get("userInfo")) : JSON.parse(localStorage.getItem("userInfo"));

    if (accessToken && userInfo) {
      // Dispatch dữ liệu vào Redux
      dispatch(setCredentials({ accessToken, userInfo }));
    }
  }, [dispatch]);

  const user = useSelector((state) => state.user);
  console.log("Redux State:", user); // Log toàn bộ state

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Nếu người dùng đã đăng nhập, chuyển đến Dashboard, nếu không thì đến Login */}
          <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/user" element={isLoggedIn ? <User /> : <Navigate to="/" />} />
          <Route path="/store" element={isLoggedIn ? <Store /> : <Navigate to="/" />} />
          <Route path="/order" element={isLoggedIn ? <Order /> : <Navigate to="/" />} />
          <Route path="/overview" element={isLoggedIn ? <Overview /> : <Navigate to="/" />} />
          <Route path="/product" element={isLoggedIn ? <Product /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
