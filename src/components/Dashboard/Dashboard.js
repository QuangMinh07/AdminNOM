import React, { useState } from "react";
import "./Dashboard.css";
import logo1 from "../../image/Logo1.png";
import userAdmin from "../../image/logo-usr-mini.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faChartBar,
  faChartPie,
  faFileInvoiceDollar,
  faCog,
  faStore,
  faShoppingCart,
  faBox,
  faUser,
  faBell,
  faEnvelope,
  faRightFromBracket,
  faSearch,
  faCalendarAlt,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout as logoutAction } from "../../Redux/Slice/userSlice";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import User from "../User/User";
import Store from "../Store/Store";
import Cookies from "js-cookie";

const Dashboard = () => {
  const [isDashboardExpanded, setIsDashboardExpanded] = useState(false);
  const [isManagementExpanded, setIsManagementExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [content, setContent] = useState("default");

  const toggleDashboardItems = () => {
    setIsDashboardExpanded(!isDashboardExpanded);
  };

  const toggleManagementItems = () => {
    setIsManagementExpanded(!isManagementExpanded);
  };

  const handleLogout = () => {
    dispatch(logoutAction()); // Xóa thông tin khỏi Redux
    Cookies.remove("accessToken");
    Cookies.remove("userInfo");
    navigate("/"); // Điều hướng về trang Login
  };

  const user = useSelector((state) => state.user.userInfo);

  console.log("User from Redux:", user); // Kiểm tra xem fullName có tồn tại không

  const handleProfileClick = () => {
    setShowModal(!showModal);
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);
    window.scrollTo(0, 0); // Cuộn trang lên đầu mỗi khi nội dung thay đổi
  };

  const renderContent = () => {
    switch (content) {
      case "user":
        return <User />;
      case "store":
        return <Store />;

      default:
        return (
          <div>
            <div className="welcomedate">
              <div>
                <p className="content-title">Dashboard</p>
                <p className="welcome-text">
                  Hi, {user?.fullName}. Welcome back to NOM Admin!
                </p>
              </div>

              <div className="date-filter-container">
                <div className="icon-wrapper">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="calendar-icon"
                  />
                </div>
                <div className="date-info">
                  <p className="filter-title">Lọc thời gian</p>
                  <p className="filter-date-range">
                    17 April 2020 - 21 May 2020
                  </p>
                </div>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="dropdown-icon"
                />
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="content">
              <button className="get-started-btn">Get started</button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Abhaya+Libre:wght@800&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      {/* Sidebar */}
      <div className="sidebar" setContent={setContent}>
        <div className="logo-containerdashboard">
          <img src={logo1} alt="Logo" className="logodashboard" />
        </div>
        <div className="sidebar-nav">
          <ul>
            <li
              className={`sidebar-item ${isDashboardExpanded ? "active" : ""}`}
              onClick={toggleDashboardItems}
            >
              <div onClick={() => handleContentChange("dashboard")}>
                <FontAwesomeIcon icon={faHouse} className="iconchinh" />
                <span className="textchinh">Dashboard</span>
              </div>
            </li>

            {isDashboardExpanded && (
              <>
                <li className="sidebar-item indent">
                  <a href="#">
                    <FontAwesomeIcon icon={faChartBar} className="iconphu" />
                    <span style={{ marginLeft: "10px" }}> Overview</span>
                  </a>
                </li>
                <li className="sidebar-item indent">
                  <a href="#">
                    <FontAwesomeIcon icon={faChartPie} className="iconphu" />
                    <span style={{ marginLeft: "10px" }}>
                      Charts and Reports
                    </span>
                  </a>
                </li>
                <li className="sidebar-item indent">
                  <a href="#">
                    <FontAwesomeIcon
                      icon={faFileInvoiceDollar}
                      className="iconphu"
                    />
                    <span style={{ marginLeft: "10px" }}>
                      Revenue & Reports
                    </span>
                  </a>
                </li>
              </>
            )}
            <li
              className={`sidebar-item ${isManagementExpanded ? "active" : ""}`}
              onClick={toggleManagementItems}
            >
              <a href="#">
                <FontAwesomeIcon icon={faCog} className="iconchinh" />
                <span className="textchinh">Management </span>
              </a>
            </li>
            {isManagementExpanded && (
              <>
                <li className="sidebar-item indent">
                  <div onClick={() => handleContentChange("store")}>
                    <FontAwesomeIcon icon={faStore} className="iconphu" />
                    <span style={{ marginLeft: "10px" }}>Store </span>
                  </div>
                </li>
                <li className="sidebar-item indent">
                  <a href="#">
                    <FontAwesomeIcon
                      icon={faShoppingCart}
                      className="iconphu"
                    />
                    <span style={{ marginLeft: "10px" }}>Order </span>
                  </a>
                </li>
                <li className="sidebar-item indent">
                  <a href="#">
                    <FontAwesomeIcon icon={faBox} className="iconphu" />
                    <span style={{ marginLeft: "10px" }}>Product </span>
                  </a>
                </li>
                <li className="sidebar-item indent">
                  <div onClick={() => handleContentChange("user")}>
                    <FontAwesomeIcon icon={faUser} className="iconphu" />
                    <span style={{ marginLeft: "10px" }}>User </span>
                  </div>
                </li>
                <li className="sidebar-item indent">
                  <a href="#">
                    <FontAwesomeIcon icon={faBell} className="iconphu" />
                    <span style={{ marginLeft: "10px" }}>Notification </span>
                  </a>
                </li>
                <li className="sidebar-item indent">
                  <a href="#">
                    <FontAwesomeIcon icon={faEnvelope} className="iconphu" />
                    <span style={{ marginLeft: "10px" }}>
                      Support & Communication
                    </span>
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div
            className={`search-container ${
              content === "dashboard" ? "" : "other-page"
            }`}
          >
            <input
              type="text"
              className={`search-input ${
                content === "dashboard" ? "" : "other-page"
              }`}
              placeholder="Search here"
            />
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </div>

          <div className="user-profile" onClick={handleProfileClick}>
            <img src={userAdmin} alt="User" className="user-img" />
            <div className="user-info">
              <p className="user-name">{user?.fullName || "Worthy AG"}</p>
            </div>
            {showModal && (
              <div className="profileModal">
                <div className="classLogout" onClick={handleLogout}>
                  <p className="logoutText">Đăng xuất</p>
                  <FontAwesomeIcon
                    icon={faRightFromBracket}
                    className="iconLogout"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
