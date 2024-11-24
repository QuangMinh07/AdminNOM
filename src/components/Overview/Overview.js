import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer } from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faChevronDown, faStore, faBoxOpen, faGavel, faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import api from "../../api";
import "./Overview.css";

const renderCustomizedLabel = ({ cx, cy, totalUsers }) => {
  return (
    <text x={cx} y={cy} fill="black" textAnchor="middle" dominantBaseline="middle" fontSize="24px" fontWeight="bold">
      {totalUsers}
    </text>
  );
};

// Hàm render biểu đồ Pie tùy chỉnh
const renderProductPie = (value, color1, color2, label) => {
  return (
    <div style={{ width: "120px", textAlign: "center" }}>
      <PieChart width={120} height={120}>
        <Pie data={[{ value }, { value: 100 - value }]} dataKey="value" cx={60} cy={60} innerRadius={40} outerRadius={50} startAngle={90} endAngle={450}>
          <Cell fill={color1} />
          <Cell fill={color2} />
        </Pie>
        <text x={60} y={60} textAnchor="middle" dominantBaseline="middle" fontSize="18px" fontWeight="bold">
          {`${value}`}
        </text>
      </PieChart>
      <p style={{ fontSize: "14px" }}>{label}</p>
    </div>
  );
};

const COLORS = ["#FFC107", "#FF7043", "#D3D3D3"];

const Overview = () => {
  const user = useSelector((state) => state.user.userInfo);

  // State để lưu dữ liệu tỷ lệ đăng nhập
  const [loginStatistics, setLoginStatistics] = useState({
    facebook: 0,
    google: 0,
    phone: 0,
  });

  useEffect(() => {
    const fetchLoginStatistics = async () => {
      try {
        const response = await api.get("/v1/admin/get-all-user-login");
        if (response.data && response.data.success) {
          const { phoneLoginCount, googleLoginCount, facebookLoginCount } = response.data.data;
          setLoginStatistics({
            phone: phoneLoginCount,
            google: googleLoginCount,
            facebook: facebookLoginCount,
          });
        }
      } catch (error) {
        console.error("Error fetching login statistics:", error);
      }
    };

    fetchLoginStatistics();
  }, []);

  // Dữ liệu cho biểu đồ cột (Tỷ lệ đăng nhập)
  const dataBar = [
    { name: "Facebook", users: loginStatistics.facebook, color: "#FF7043" },
    { name: "Gmail", users: loginStatistics.google, color: "#FFC107" },
    { name: "Phone", users: loginStatistics.phone, color: "#4CAF50" },
  ];

  // State cho doanh thu và dữ liệu biểu đồ
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueData, setRevenueData] = useState([]);

  // State for store data
  const [totalStores, setTotalStores] = useState(0);

  // State cho sản phẩm và đơn hàng
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalFoods, setTotalFoods] = useState(0);
  const [canceledOrders, setCanceledOrders] = useState(0);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await api.get("/v1/admin/get-all-store");
        if (response.data && response.data.success) {
          // Filter stores where isOpen is true
          const openStores = response.data.data.filter((store) => store.isOpen === true);
          setTotalStores(openStores.length); // Set the number of open stores
        }
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    };

    const fetchFoodData = async () => {
      try {
        const response = await api.get("/v1/admin/get-all-food");

        if (response.data) {
          // Lấy tổng số món ăn từ API
          const totalFoodCount = response.data.totalItems;
          setTotalFoods(totalFoodCount);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API món ăn:", error);
      }
    };

    const fetchOrderData = async () => {
      try {
        const response = await api.get("/v1/admin/get-all-order");

        if (response.data) {
          // Lấy tổng số đơn hàng và đơn hàng hủy
          const totalOrderCount = response.data.totalOrdersCount;
          const totalCanceledOrders = response.data.allOrdersDetails.filter((order) => order.orderStatus === "Canceled").length;

          setTotalOrders(totalOrderCount);
          setCanceledOrders(totalCanceledOrders);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API đơn hàng:", error);
      }
    };

    fetchFoodData();
    fetchOrderData();
    fetchStoreData();
  }, []);

  // State cho tổng số người dùng và dữ liệu biểu đồ
  const [totalUsers, setTotalUsers] = useState(0);
  const [userData, setUserData] = useState([
    { name: "Người bán", value: 0 },
    { name: "Người mua", value: 0 },
    { name: "Người chạy", value: 0 },
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/v1/admin/get-all");

        if (response.data && response.data.success) {
          // Lấy dữ liệu người dùng từ API
          const users = response.data.data;
          const totalUserCount = response.data.totalUsers;

          // Phân loại người dùng
          const roleCounts = { seller: 0, customer: 0, shipper: 0 };
          users.forEach((user) => {
            if (user.roleId === "seller") roleCounts.seller += 1;
            else if (user.roleId === "customer") roleCounts.customer += 1;
            else if (user.roleId === "shipper") roleCounts.shipper += 1;
          });

          // Cập nhật dữ liệu biểu đồ
          setUserData([
            { name: "Người bán", value: roleCounts.seller },
            { name: "Người mua", value: roleCounts.customer },
            { name: "Người chạy", value: roleCounts.shipper },
          ]);

          // Cập nhật tổng số tài khoản
          setTotalUsers(totalUserCount);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API người dùng:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchDeliveredOrdersAndRevenue = async () => {
      try {
        const response = await api.get("/v1/admin/revenue");

        if (response.data) {
          const { totalRevenue, deliveredOrdersDetails } = response.data;

          // Cập nhật doanh thu tổng
          setTotalRevenue(totalRevenue);

          // Cập nhật dữ liệu biểu đồ doanh thu theo tháng
          const monthlyData = deliveredOrdersDetails.reduce((acc, order) => {
            const month = new Date(order.orderDate).toLocaleString("default", { month: "short" });
            const existingMonth = acc.find((item) => item.name === month);

            if (existingMonth) {
              existingMonth.revenue += order.totalAmount;
            } else {
              acc.push({ name: month, revenue: order.totalAmount });
            }

            return acc;
          }, []);

          setRevenueData(monthlyData);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API doanh thu:", error);
      }
    };

    fetchDeliveredOrdersAndRevenue();
  }, []);

  return (
    <div className="overview-wrapper">
      <div className="welcomedate">
        <div>
          <p className="content-title">Overview</p>
          <p className="welcome-text">Hi, {user?.fullName || "Samantha"}. Welcome back to NOM Admin!</p>
        </div>

        <div className="date-filter-container">
          <div className="icon-wrapperoverview">
            <FontAwesomeIcon icon={faCalendarAlt} className="calendar-iconoverview" />
          </div>
          <div className="date-info">
            <p className="filter-title">Lọc thời gian</p>
            <p className="filter-date-range">17 April 2020 - 21 May 2020</p>
          </div>
          <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" />
        </div>
      </div>

      <div className="quick-info">
        <div className="info-block">
          <div className="khungicon">
            <FontAwesomeIcon icon={faStore} className="info-icon" />
          </div>
          <div className="infonumbertext">
            <p className="info-number">{totalStores}</p>
            <p className="info-text">Cửa hàng đang hoạt động</p>
          </div>
        </div>
        <div className="info-block">
          <div className="khungicon">
            <FontAwesomeIcon icon={faBoxOpen} className="info-icon" />
          </div>
          <div className="infonumbertext">
            <p className="info-number">{totalFoods}</p>
            <p className="info-text">Sản phẩm được đăng bán</p>
          </div>
        </div>
        <div className="info-block">
          <div className="khungicon">
            <FontAwesomeIcon icon={faGavel} className="info-icon" />
          </div>
          <div className="infonumbertext">
            <p className="info-number">75</p>
            <p className="info-text">Tranh chấp chờ giải quyết</p>
          </div>
        </div>
        <div className="info-block">
          <div className="khungicon">
            <FontAwesomeIcon icon={faMoneyBillWave} className="info-icon" />
          </div>
          <div className="infonumbertext">
            <p className="info-numberDoanhthu">{totalRevenue.toLocaleString("vi-VN")}</p>
            <p className="info-text1">Doanh thu</p>
          </div>
        </div>
      </div>

      <div className="bieudo">
        <div className="chart-container pie-chart">
          <h2>Tổng người dùng</h2>
          <PieChart width={200} height={200}>
            <Pie data={userData} cx={100} cy={100} labelLine={false} outerRadius={70} innerRadius={50} fill="#8884d8" dataKey="value" label={(props) => renderCustomizedLabel({ ...props, totalUsers })}>
              {userData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
          <div className="legend">
            <div>
              <span style={{ backgroundColor: "#FF7043", padding: "5px", borderRadius: "50%" }}></span>
              <span className="legend-label">Người bán</span>
            </div>
            <div>
              <span style={{ backgroundColor: "#FFC107", padding: "5px", borderRadius: "50%" }}></span>
              <span className="legend-label">Người mua</span>
            </div>
            <div>
              <span style={{ backgroundColor: "#D3D3D3", padding: "5px", borderRadius: "50%" }}></span>
              <span className="legend-label">Người giao</span>
            </div>
          </div>
        </div>

        {/* Biểu đồ Doanh thu tất cả cửa hàng */}
        <div className="chart-container1 large-line-chart">
          <h2>Doanh thu tất cả cửa hàng</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueData} margin={{ top: 15, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#ff6b6b" strokeWidth={2} dot={{ fill: "#000", r: 4 }} activeDot={{ r: 6, stroke: "#fff", strokeWidth: 1 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bieudo">
        <div className="chart-container2 bar-chart">
          <h2>Tỷ lệ đăng nhập hệ thống</h2>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={dataBar} barSize={30}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users">
                {dataBar.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Phần Biểu đồ Sản phẩm */}
        <div className="chart-container3 product-charts">
          <h2>Sản phẩm</h2>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {renderProductPie(totalOrders, "#F44336", "#FFCDD2", "Đơn hàng")}
            {renderProductPie(totalFoods, "#4CAF50", "#C8E6C9", "Sản phẩm bán")}
            {renderProductPie(canceledOrders, "#FFEB3B", "#FFF9C4", "Hủy đơn")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
