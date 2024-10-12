import React from "react";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer } from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faChevronDown, faStore, faBoxOpen, faGavel, faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import "./Overview.css";

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={cx} y={cy} fill="black" textAnchor="middle" dominantBaseline="middle" fontSize="16px" fontWeight="bold">
      5,824,213
    </text>
  );
};

// Dữ liệu cho biểu đồ tròn
const dataPie = [
  { name: "Người bán", value: 5244213 },
  { name: "Người mua", value: 3567842 },
  { name: "Ngườu chạy", value: 500000 },
];

// Dữ liệu cho biểu đồ cột (Tỷ lệ đăng nhập)
const dataBar = [
  { name: "Facebook", users: 24000, color: "#FF7043" }, // Cam
  { name: "Gmail", users: 30000, color: "#FFC107" }, // Vàng
  { name: "Phone", users: 20000, color: "#4CAF50" }, // Xanh lá
];

// Dữ liệu cho biểu đồ tròn (Sản phẩm)
const dataProduct = [
  { name: "Đơn hàng", value: 81, color1: "#F44336", color2: "#FFCDD2" }, // Đỏ và nhạt
  { name: "Sản phẩm bán", value: 22, color1: "#4CAF50", color2: "#C8E6C9" }, // Xanh lá và nhạt
  { name: "Hủy đơn", value: 62, color1: "#FFEB3B", color2: "#FFF9C4" }, // Vàng và nhạt
];

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
          {`${value}M`}
        </text>
      </PieChart>
      <p style={{ fontSize: "14px" }}>{label}</p>
    </div>
  );
};

const COLORS = ["#FFC107", "#FF7043", "#D3D3D3"];

const dataLine = [
  { name: "Jan", revenue: 10000 },
  { name: "Feb", revenue: 15000 },
  { name: "Mar", revenue: 20000 },
  { name: "Apr", revenue: 25000 },
  { name: "May", revenue: 38753 },
  { name: "Jun", revenue: 30000 },
];

const Overview = () => {
  const user = useSelector((state) => state.user.userInfo);

  return (
    <div className="overview-wrapper">
      <div className="welcomedate">
        <div>
          <p className="content-title">Dashboard</p>
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
            <p className="info-number">75</p>
            <p className="info-text">Cửa hàng đang hoạt động</p>
          </div>
        </div>
        <div className="info-block">
          <div className="khungicon">
            <FontAwesomeIcon icon={faBoxOpen} className="info-icon" />
          </div>
          <div className="infonumbertext">
            <p className="info-number">75</p>
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
            <p className="info-number">10.000.000</p>
            <p className="info-text1">Doanh thu</p>
          </div>
        </div>
      </div>

      <div className="bieudo">
        <div className="chart-container pie-chart">
          <h2>Tổng người dùng</h2>
          <PieChart width={200} height={200}>
            <Pie data={dataPie} cx={100} cy={100} labelLine={false} outerRadius={70} innerRadius={50} fill="#8884d8" dataKey="value" label={renderCustomizedLabel}>
              {dataPie.map((entry, index) => (
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
              <span className="legend-label">Người chạy</span>
            </div>
          </div>
        </div>

        {/* Biểu đồ Doanh thu tất cả cửa hàng */}
        <div className="chart-container1 large-line-chart">
          <h2>Doanh thu tất cả cửa hàng</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dataLine} margin={{ top: 15, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#ff6b6b" strokeWidth={2} dot={{ fill: "#000", r: 4 }} activeDot={{ r: 6, stroke: "#fff", strokeWidth: 1 }} /> {/* Giảm kích thước các điểm dot */}
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
          <div style={{ display: "flex", justifyContent: "space-around" }}>{dataProduct.map((item) => renderProductPie(item.value, item.color1, item.color2, item.name))}</div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
