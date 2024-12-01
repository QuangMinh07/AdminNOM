import React, { useState, useEffect, useCallback } from "react";
import "./Order.css";
import "./ModalOrder.css";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import api from "../../api"; // Import apiService thay vì axios
import { Helmet } from "react-helmet";
import OrderDetail from "./OrderDetail"; // Import component chi tiết sản phẩm

const Order = () => {
  const user = useSelector((state) => state.user.userInfo);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState("fullName", "orderDate"); // Mặc định sắp xếp theo tên
  const [sortOrder, setSortOrder] = useState("asc"); // Mặc định sắp xếp tăng dần
  const [filterStatus, setFilterStatus] = useState(null); // Lọc theo trạng thái (online, offline)
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // Món ăn được chọn để hiển thị chi tiết
  const [selectedOrders, setSelectedOrders] = useState([]); // Trạng thái các đơn hàng được chọn
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading

  const openOrderDetail = (order) => {
    setSelectedOrder(order); // Mở chi tiết món ăn
  };

  const closeOrderDetail = () => {
    setSelectedOrder(null); // Đóng chi tiết món ăn
  };

  const fetchOrders = useCallback(
    async (page = 1) => {
      try {
        const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
        console.log("Token from localStorage:", token);

        if (!token) {
          throw new Error("Token không tồn tại");
        }

        const response = await api.get("/v1/admin/get-all-order", {
          params: {
            page,
            limit: 10,
            sortField,
            sortOrder,
            orderStatus: filterStatus,
          },
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong headers
          },
        });

        if (response.data.allOrdersDetails) {
          setOrders(response.data.allOrdersDetails);
          setTotalPages(response.data.totalPages);
          setCurrentPage(page);
        } else {
          console.error("Error fetching users:", response.data.msg);
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    },
    [sortField, sortOrder, filterStatus] // Thêm currentPage vào dependencies
  );

  useEffect(() => {
    fetchOrders(currentPage);
  }, [fetchOrders, currentPage]);

  // Hàm xử lý sắp xếp tên đăng nhập
  const handleSortClick = (field) => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc")); // Đảo ngược thứ tự sắp xếp
    setSortField(field); // Cập nhật trường sắp xếp
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status); // Cập nhật trạng thái được chọn
    setShowStatusFilter(false); // Đóng menu lọc
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]));
  };

  const handleSelectAllOrders = (isChecked) => {
    if (isChecked) {
      setSelectedOrders(orders.map((order) => order.orderId));
    } else {
      setSelectedOrders([]);
    }
  };

  const sendNotifications = async () => {
    if (selectedOrders.length === 0) {
      alert("Vui lòng chọn ít nhất một đơn hàng để gửi thông báo.");
      return;
    }

    const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
    setIsLoading(true); // Hiển thị loading

    try {
      await api.post(
        "/v1/admin/send-notification",
        { orderIds: selectedOrders },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong headers
          },
        }
      );
      alert("Thông báo đã được gửi thành công!");
      setSelectedOrders([]); // Reset danh sách đơn hàng được chọn
      // Gọi lại hàm fetchOrders để cập nhật danh sách đơn hàng
      fetchOrders(currentPage);
    } catch (error) {
      console.error("Lỗi khi gửi thông báo:", error.message);
      alert("Đã xảy ra lỗi khi gửi thông báo.");
    } finally {
      setIsLoading(false); // Ẩn loading sau khi API hoàn tất
    }
  };

  return (
    <div className="user-container">
      <Helmet>
        <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500&display=swap" rel="stylesheet" />
      </Helmet>
      {isLoading && (
        <div className="loading-overlayOrder">
          <div className="spinnerOrder"></div>
        </div>
      )}
      <div className="header">
        <div>
          <h1 className="title">Order</h1>
          <p className="welcome-textuser">Hi, {user?.fullName}. Welcome back to NOM Admin!</p>
        </div>
        <div className="button-group">
          <button className="btn btn-deleteuser" onClick={sendNotifications}>
            Gửi thông báo
          </button>
        </div>
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th>
              <label className="custom-checkbox">
                <input type="checkbox" className="checkbox" checked={selectedOrders.length === orders.length && orders.length > 0} onChange={(e) => handleSelectAllOrders(e.target.checked)} />
                <span className="checktitle"></span>
              </label>
            </th>
            <th>STT</th>
            <th>Mã Đơn hàng</th>
            <th>
              <div className="divdangnhap" onClick={() => handleSortClick("user.fullName")}>
                <p style={{ width: "80px" }}>Tên khách hàng</p>
                <FontAwesomeIcon icon={faSort} className="sort-icon" />
              </div>
            </th>
            <th>
              <div className="divdangnhap" onClick={() => handleSortClick("totalAmount")}>
                <p>Giá tiền</p>
                <FontAwesomeIcon icon={faSort} className="sort-icongiatien" />
              </div>
            </th>
            <th>
              <div className="divdangnhap" onClick={() => handleSortClick("orderDate")}>
                <p>Thời gian</p>
                <FontAwesomeIcon icon={faSort} className="sort-icongiatien" />
              </div>
            </th>
            <th className="filter-header">
              <div className="divdangnhap">
                <p style={{ width: "80px" }}>Trạng thái</p>
                <FontAwesomeIcon icon={faSort} className="sort-icondangnhap" onClick={() => setShowStatusFilter(!showStatusFilter)} />
              </div>
            </th>
            <th className="filter-header">
              <div className="divdangnhap">
                <p style={{ width: "100px" }}>Xem Thêm</p>
              </div>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <tr key={order._id}>
                <td>
                  <label className="custom-checkbox">
                    <input type="checkbox" className="checkbox" checked={selectedOrders.includes(order.orderId)} onChange={() => handleSelectOrder(order.orderId)} />
                    <span className="checkmark"></span>
                  </label>
                </td>
                <td>{(currentPage - 1) * 10 + index + 1}</td>
                <td style={{ color: order.isNotificationSent ? "red" : "inherit" }}>{order.orderId}</td>
                <td>{order.user?.fullName || "N/A"}</td>
                <td>{order.totalAmount} VND</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td className="statusorder">{order.orderStatus === "Pending" ? <span className="status-pending">Chờ xử lý</span> : order.orderStatus === "Processing" ? <span className="status-processing">Đang chuẩn bị</span> : order.orderStatus === "Shipped" ? <span className="status-shipped">Shipper đã chấp nhận giao đơn hàng</span> : order.orderStatus === "Completed" ? <span className="status-completed">Đang hoàn thành đơn hàng</span> : order.orderStatus === "Received" ? <span className="status-received">Đang giao</span> : order.orderStatus === "Delivered" ? <span className="status-delivered">Hoàn thành</span> : order.orderStatus === "Cancelled" ? <span className="status-cancelled">Đã hủy</span> : <span className="status-unknown">Không xác định</span>}</td>
                <td>
                  <button
                    style={{
                      border: "none", // Xóa khung (border)
                      outline: "none", // Xóa outline khi focus
                      background: "transparent", // Loại bỏ màu nền nếu không muốn
                      color: "red", // Màu chữ
                      cursor: "pointer", // Con trỏ dạng tay khi hover
                    }}
                    onClick={() => openOrderDetail(order)}
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">Không có đơn hàng</td>
            </tr>
          )}
        </tbody>
      </table>

      {showStatusFilter && (
        <div className="filter-dropdown">
          <ul>
            <li className="dropdown-item" onClick={() => handleStatusFilter(null)}>
              Tất cả
            </li>
            <li className="dropdown-item" onClick={() => handleStatusFilter("Pending")}>
              Chờ xử lý
            </li>
            <li className="dropdown-item" onClick={() => handleStatusFilter("Processing")}>
              Đang chuẩn bị
            </li>
            <li className="dropdown-item" onClick={() => handleStatusFilter("Shipped")}>
              Shipper đã chấp nhận giao đơn hàng
            </li>
            <li className="dropdown-item" onClick={() => handleStatusFilter("Completed")}>
              Đang hoàn thành đơn hàng
            </li>
            <li className="dropdown-item" onClick={() => handleStatusFilter("Received")}>
              Đang giao
            </li>
            <li className="dropdown-item" onClick={() => handleStatusFilter("Delivered")}>
              Hoàn thành
            </li>
            <li className="dropdown-item" onClick={() => handleStatusFilter("Cancelled")}>
              Đã hủy
            </li>
          </ul>
        </div>
      )}
      {selectedOrder && <OrderDetail oderDetail={selectedOrder} onClose={closeOrderDetail} />}

      <div className="pagination">
        <button
          className="pagination-button"
          disabled={currentPage === 1 || totalPages === 1} // Nút "Trước" bị vô hiệu nếu ở trang đầu tiên hoặc chỉ có một trang
          onClick={() => {
            setCurrentPage((prev) => {
              const newPage = Math.max(prev - 1, 1); // Giảm trang hiện tại
              window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn lên đầu trang
              return newPage;
            });
          }}
        >
          Trước
        </button>
        <span className="pagination-info">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          className="pagination-button"
          disabled={currentPage === totalPages || totalPages === 1} // Nút "Tiếp" bị vô hiệu nếu ở trang cuối cùng hoặc chỉ có một trang
          onClick={() => {
            setCurrentPage((prev) => {
              const newPage = Math.min(prev + 1, totalPages); // Tăng trang hiện tại
              window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn lên đầu trang
              return newPage;
            });
          }}
        >
          Tiếp
        </button>
      </div>
    </div>
  );
};

export default Order;
