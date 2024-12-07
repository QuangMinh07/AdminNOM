import React, { useState, useEffect } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import "chart.js/auto"; // Dùng để auto-import các chart types
import "./ChartsAndReports.css";
import { FaDollarSign, FaShoppingCart, FaGift, FaSmile } from "react-icons/fa"; // Import icon từ React Icons
import foodType1 from "../../image/foodtype1.png";
import foodType2 from "../../image/foodtype2.png";
import foodType3 from "../../image/foodtype3.png";
import foodType4 from "../../image/foodtype4.png";
import foodType5 from "../../image/foodtype5.png";
import foodType6 from "../../image/foodtype6.png";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import api from "../../api"; // Import apiService thay vì axios

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const ChartsAndReports = () => {
  const [storeRevenueData, setStoreRevenueData] = useState(null);
  const [paymentMethodRevenue, setPaymentMethodRevenue] = useState(null);
  const [revenueByMonthAndYear, setRevenueByMonthAndYear] = useState([]); // State mới cho dữ liệu doanh thu theo tháng và năm
  const [currentYearRevenue, setCurrentYearRevenue] = useState(0); // State cho doanh thu năm hiện tại

  useEffect(() => {
    // Gọi API để lấy dữ liệu doanh thu theo danh mục sản phẩm
    const fetchData = async () => {
      try {
        const response = await api.get("/v1/admin/revenuefoodtype"); // Gọi API qua instance axios
        console.log(response.data); // In ra dữ liệu API để kiểm tra

        setStoreRevenueData(response.data); // Lưu toàn bộ dữ liệu API vào state
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu doanh thu:", error);
      }
    };

    fetchData();
  }, []); // Chạy 1 lần khi component mount

  useEffect(() => {
    const fetchPaymentMethodRevenue = async () => {
      try {
        const response = await api.get("/v1/admin/revenuepayment");
        setPaymentMethodRevenue(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy doanh thu theo phương thức thanh toán:", error);
      }
    };

    fetchPaymentMethodRevenue();
  }, []);

  useEffect(() => {
    // Gọi API để lấy doanh thu theo tháng và năm
    const fetchRevenueByMonthAndYear = async () => {
      try {
        const response = await api.get("/v1/admin/revenue-by-month-year");
        setRevenueByMonthAndYear(response.data.revenueByMonthAndYear); // Lưu dữ liệu vào state
        // Tính tổng doanh thu của năm hiện tại
        const currentYear = new Date().getFullYear();
        const currentYearData = response.data.revenueByMonthAndYear.filter((item) => item._id.year === currentYear);
        const totalRevenue = currentYearData.reduce((acc, item) => acc + item.totalRevenue, 0);
        setCurrentYearRevenue(totalRevenue); // Lưu doanh thu năm hiện tại
      } catch (error) {
        console.error("Lỗi khi lấy doanh thu theo tháng và năm:", error);
      }
    };

    fetchRevenueByMonthAndYear();
  }, []); // Chỉ gọi một lần khi component mount

  if (!storeRevenueData || !paymentMethodRevenue || revenueByMonthAndYear.length === 0) {
    return <div>Loading...</div>; // Hiển thị Loading nếu chưa có dữ liệu
  }

  const monthlyRevenue = Array(12).fill(0); // Mảng doanh thu mỗi tháng, khởi tạo là 0

  revenueByMonthAndYear.forEach((item) => {
    const monthIndex = item._id.month - 1; // Tháng bắt đầu từ 1, nên trừ 1
    if (monthIndex >= 0 && monthIndex < 12) {
      monthlyRevenue[monthIndex] = item.totalRevenue;
    }
  });

  const data2 = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"], // Các tháng trong năm
    datasets: [
      {
        label: "Doanh thu theo tháng", // Dòng cho doanh thu theo tháng
        data: monthlyRevenue, // Dữ liệu doanh thu cho từng tháng
        borderColor: "#FF5252", // Màu đỏ cho doanh thu theo tháng
        backgroundColor: "rgba(255, 82, 82, 0.2)", // Màu nền đỏ nhạt
        borderWidth: 2,
        fill: true, // Điền màu nền
        tension: 0.4,
        pointStyle: "circle",
        pointRadius: 6,
      },
      {
        label: `Doanh thu theo năm ${new Date().getFullYear()}`, // Dòng cho doanh thu theo năm hiện tại
        data: Array(12).fill(currentYearRevenue), // Cột doanh thu theo năm
        borderColor: "#4CAF50", // Màu xanh cho doanh thu theo năm
        backgroundColor: "rgba(76, 175, 80, 0.2)", // Màu nền xanh nhạt
        borderWidth: 2,
        fill: true, // Điền màu nền
        tension: 0.4,
        pointStyle: "circle",
        pointRadius: 6,
      },
    ],
  };

  const options1 = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom", // Vị trí của chú thích
        labels: {
          font: {
            size: 14,
          },
        },
        display: true, // Hiển thị chú thích
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
        },
      },
      y: {
        title: {
          display: true,
        },
        min: 0,
        ticks: {
          stepSize: 5000, // Tăng bước ticks cho doanh thu
        },
      },
    },
  };

  const data1 = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"], // Các tháng
    datasets: ["Cash", "Card", "Payos", "Bank"].map((paymentMethod) => {
      // Kiểm tra nếu phương thức thanh toán có trong dữ liệu
      const revenueData = paymentMethodRevenue.revenueByPaymentMethod[paymentMethod] || []; // Nếu không có dữ liệu, gán là mảng rỗng

      const monthlyRevenue = Array(12).fill(0); // Mảng doanh thu mỗi tháng

      // Cập nhật doanh thu cho mỗi tháng từ dữ liệu trả về
      revenueData.forEach((item) => {
        if (item.month >= 1 && item.month <= 12) {
          monthlyRevenue[item.month - 1] = item.totalRevenue; // Tháng bắt đầu từ 1, nên cần trừ 1
        }
      });

      return {
        label: paymentMethod,
        data: monthlyRevenue,
        borderColor: paymentMethod === "Cash" ? "#A700FF" : paymentMethod === "Card" ? "#FF5252" : paymentMethod === "Payos" ? "#3CD856" : "#FFC107", // Màu sắc cho từng phương thức
        backgroundColor: paymentMethod === "Cash" ? "#A700FF" : paymentMethod === "Card" ? "#FF5252" : paymentMethod === "Payos" ? "#3CD856" : "#FFC107", // Màu nền
        borderWidth: 3,
        tension: 0.4,
        pointStyle: "circle",
        pointRadius: 6,
      };
    }),
  };

  // Tùy chỉnh biểu đồ
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom", // Chỉnh vị trí legend xuống dưới trục X
        labels: {
          padding: 20, // Để có thêm không gian giữa các labels và trục X
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: { title: { display: true } },
      y: { title: { display: true }, min: 0 },
    },
  };

  const data = {
    labels: ["Món chính", "Ăn kèm", "Đồ uống", "Tráng miệng", "Món chay", "Combo"],
    datasets: [
      {
        data: [
          storeRevenueData.storeRevenuePerFoodType["Món chính"] || 0, // Lấy doanh thu cho "Món chính"
          storeRevenueData.storeRevenuePerFoodType["Ăn kèm"] || 0, // Nếu không có, trả về 0
          storeRevenueData.storeRevenuePerFoodType["Đồ uống"] || 0, // Lấy doanh thu cho "Đồ uống"
          storeRevenueData.storeRevenuePerFoodType["Tráng miệng"] || 0,
          storeRevenueData.storeRevenuePerFoodType["Món chay"] || 0,
          storeRevenueData.storeRevenuePerFoodType["Combo"] || 0,
        ],
        backgroundColor: [
          "#5E5CE6", // Món chính
          "#EA6A12", // Ăn kèm
          "#E08080", // Đồ uống
          "#4CAF50", // Tráng miệng
          "#FFC107", // Món chay
          "#E53935", // Combo
        ],
        borderWidth: 0,
      },
    ],
  };

  console.log("Dữ liệu cho biểu đồ sau khi cập nhật:", data);

  console.log("Dữ liệu cho biểu đồ:", data); // Kiểm tra dữ liệu trước khi render
  console.log("Dữ liệu storeRevenuePerFoodType:", storeRevenueData.storeRevenuePerFoodType);

  const images = [
    foodType1, // Món chính
    foodType2, // Ăn kèm
    foodType3, // Đồ uống
    foodType4, // Tráng miệng
    foodType5, // Món chay
    foodType6, // Combo
  ];

  const cards = [
    {
      title: "Doanh thu",
      icon: <FaDollarSign style={{ color: "#f9c74f" }} />,
      color: "yellow",
    },
    {
      title: "Đơn hàng",
      icon: <FaShoppingCart style={{ color: "red" }} />,
      color: "red",
    },
    {
      title: "Điểm thưởng",
      icon: <FaGift style={{ color: "#43aa8b" }} />,
      color: "green",
    },
    {
      title: "Mức độ hài lòng",
      icon: <FaSmile style={{ color: "#577590" }} />,
      color: "blue",
    },
  ];

  return (
    <div className="dashboard">
      {/* Header Cards */}
      <div className="header-cards">
        {cards.map((card, index) => (
          <div className="card" key={index}>
            <div className={`card-header ${card.color}`}></div>
            <div className="card-body">
              <div className="text">
                <h4 className="cardtitle">{card.title}</h4>
              </div>
              <div className="icon-container">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="chart-line-chart">
        {/* Charts Section */}
        <div className="chart-containerChartAnhReports">
          <h3 className="chart-title">Doanh thu theo danh mục sản phẩm</h3>
          <div className="doughnut-chart">
            <Doughnut
              data={data}
              options={{
                cutout: "70%",
                plugins: {
                  legend: { display: false },
                },
              }}
            />
            <div className="chart-center">
              <p>{storeRevenueData.totalRevenue.toLocaleString("en-US")}</p>
            </div>
          </div>
          <div className="categories">
            {data.labels.map((label, index) => (
              <div key={index} className="category">
                <div
                  className="category-icon"
                  style={{
                    borderColor: data.datasets[0].backgroundColor[index],
                  }}
                >
                  <img src={images[index]} alt={label} />
                </div>
                <p
                  style={{
                    color: data.datasets[0].backgroundColor[index], // Màu chữ theo biểu đồ
                    fontWeight: "bold", // Làm đậm chữ
                  }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="line-chart-container">
          <h3 className="chart-title1">Doanh thu theo phương thức thanh toán</h3>
          <div className="line-chart1">
            <Line data={data1} options={options} />
          </div>
        </div>
      </div>
      <div className="line-chart-container1">
        <h3 className="chart-title2">Doanh thu theo thời gian</h3>
        <div className="line-chart2">
          <Line data={data2} options={options1} />
        </div>
      </div>
    </div>
  );
};

export default ChartsAndReports;
