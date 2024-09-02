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
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout as logoutAction } from "../../Redux/Slice/userSlice";

const Dashboard = () => {
  const [isDashboardExpanded, setIsDashboardExpanded] = useState(false);
  const [isManagementExpanded, setIsManagementExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleDashboardItems = () => {
    setIsDashboardExpanded(!isDashboardExpanded);
  };

  const toggleManagementItems = () => {
    setIsManagementExpanded(!isManagementExpanded);
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    console.log("Logging out...");
    if (user?.roleId === "admin") {
      navigate("/");
    }
  };

  const user = useSelector((state) => state.user.userInfo);

  console.log("User from Redux:", user); // Kiểm tra xem fullName có tồn tại không

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-containerdashboard">
          <img src={logo1} alt="Logo" className="logodashboard" />
        </div>
        <div className="sidebar-nav">
          <ul>
            <li
              className={`sidebar-item ${isDashboardExpanded ? "active" : ""}`}
              onClick={toggleDashboardItems}
            >
              <a href="#">
                <FontAwesomeIcon icon={faHouse} className="iconchinh" />
                <span className="textchinh">Dashboard</span>
              </a>
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
                  <a href="#">
                    <FontAwesomeIcon icon={faStore} className="iconphu" />
                    <span style={{ marginLeft: "10px" }}>Store </span>
                  </a>
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
                  <a href="#">
                    <FontAwesomeIcon icon={faUser} className="iconphu" />
                    <span style={{ marginLeft: "10px" }}>User </span>
                  </a>
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
          <input
            type="text"
            placeholder="Search here"
            className="search-input"
          />

          <div className="user-profile">
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

        <div>
          <p className="content-title">Dashboard</p>
          <p className="welcome-text">
            Hi, {user?.fullName}. Welcome back to NOM Admin!
          </p>
        </div>

        {/* Dashboard Content */}
        <div className="content">
          <button className="get-started-btn">Get started</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
