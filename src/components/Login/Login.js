import React, { useState } from "react";
import background from "../../image/backgorund.png";
import "../Login/Login.css";
import logo from "../../image/Logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../Redux/Slice/userSlice";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import thư viện js-cookie

const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      const response = await fetch("http://localhost:5000/v1/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Login failed");
        throw new Error(data.error || "Login failed");
      }

      const { token, admin } = data; // Lấy thông tin từ phản hồi backend

      // Lưu token và userInfo vào cookie
      Cookies.set("accessToken", token, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set(
        "userInfo",
        JSON.stringify({
          id: admin.id,
          userName: admin.userName,
          fullName: admin.fullName,
          role: admin.role,
        }),
        { expires: 7 }
      );

      // Lưu vào localStorage
      localStorage.setItem("accessToken", token);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          id: admin.id,
          userName: admin.userName,
          fullName: admin.fullName,
          role: admin.role,
        })
      );

      // Dispatch credentials to redux store
      dispatch(
        setCredentials({
          accessToken: token,
          userInfo: {
            id: admin.id,
            userName: admin.userName,
            fullName: admin.fullName,
            role: admin.role,
          },
        })
      );

      navigate("/dashboard");

      alert("Đăng nhập thành công!");
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    loginUser();
  };

  return (
    <div className="containerLogin">
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Petrona:wght@400&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <img src={background} alt="background" className="imgbackground" />
      <div className="login-container">
        <div className="login-box">
          <div className="login-content">
            <div>
              <img src={logo} alt="NOM" className="logo" />
            </div>
            <div className="noidunglogin">
              <p className="Login">LOGIN</p>
              <p className="textLogin">
                Chào mừng bạn đến với ADMIN của hệ thống ứng dụng NOM!
              </p>
              <form onSubmit={handleSubmit} className="login-inputs">
                <div className="input-group">
                  <label className="lableLogin">Tên đăng nhập</label>
                  <input
                    type="text"
                    placeholder="Nguyễn Thị Kiều Nghi"
                    className="login-username-input"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div className="input-group1">
                  <label className="lableLogin">Mật khẩu</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="123456789"
                    className="login-password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <FontAwesomeIcon
                    icon={faEye}
                    className="icon-eye"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
                <button type="submit" className="buttonlogin">
                  <p className="login-heading">LOGIN</p>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
