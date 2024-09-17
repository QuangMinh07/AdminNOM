import React, { useState, useEffect } from "react";
import axios from "axios";
import "./User.css";
import "./Modal.css";
import { FiSliders } from "react-icons/fi";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal"; // Thêm thư viện react-modal để hiển thị modal
import api from "../../api"; // Import apiService thay vì axios
import { Helmet } from "react-helmet";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";

const User = () => {
  const user = useSelector((state) => state.user.userInfo);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false); // Trạng thái modal duyệt người bán
  const [modalUserDetailIsOpen, setModalUserDetailIsOpen] = useState(false); // Trạng thái modal chi tiết người dùng
  const [selectedUserId, setSelectedUserId] = useState(null); // Lưu user đang được duyệt/từ chối
  const [selectedDetailUser, setSelectedDetailUser] = useState(null); // Lưu thông tin người dùng được chọn để hiển thị chi tiết
  const [sortField, setSortField] = useState("userName"); // Mặc định sắp xếp theo tên
  const [sortOrder, setSortOrder] = useState("asc"); // Mặc định sắp xếp tăng dần
  const [filterStatus, setFilterStatus] = useState(null); // Lọc theo trạng thái (online, offline)
  const [filterRole, setFilterRole] = useState(null); // Lọc theo vai trò (customer, seller, shipper)
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [showRoleFilter, setShowRoleFilter] = useState(false);
  const [storeCount, setStoreCount] = useState(0); // Thêm state để lưu số lượng cửa hàng

  const fetchUsers = async (page = 1) => {
    try {
      const response = await api.get("/v1/admin/get-all-user", {
        params: {
          page: page,
          limit: 10,
          sortField: sortField,
          sortOrder: sortOrder,
          isOnline: filterStatus,
          role: filterRole,
        },
      });

      if (response.data.success) {
        setUsers(response.data.data);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.page);
      } else {
        console.error("Error fetching users:", response.data.msg);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, sortField, sortOrder, filterStatus, filterRole]);

  // Hàm xử lý sắp xếp tên đăng nhập
  const handleSortClick = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    setSortField("userName");
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
    setShowStatusFilter(false);
  };

  const handleRoleFilter = (role) => {
    setFilterRole(role);
    setShowRoleFilter(false);
  };

  const handleApprove = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "http://localhost:5000/v1/admin/approve-seller",
        { userId: selectedUserId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message) {
        alert("Người dùng đã được duyệt thành công!");
        fetchUsers(); // Refresh the user list after approving
        closeModal(); // Đóng modal
      }
    } catch (error) {
      console.error("Error approving seller:", error.message);
      alert("Lỗi khi duyệt người dùng");
    }
  };

  const handleReject = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "http://localhost:5000/v1/admin/reject-seller",
        { userId: selectedUserId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message) {
        alert("Người dùng đã bị từ chối và chuyển thành customer.");
        fetchUsers(); // Refresh the user list after rejecting
        closeModal(); // Đóng modal
      }
    } catch (error) {
      console.error("Error rejecting seller:", error.message);
      alert("Lỗi khi từ chối người dùng");
    }
  };

  // Hàm mở modal chi tiết người dùng khi nhấn vào dấu ba chấm
  const openUserDetailModal = async (user) => {
    setSelectedDetailUser(user); // Lưu thông tin người dùng
    setModalUserDetailIsOpen(true); // Mở modal chi tiết

    try {
      const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
      const response = await axios.post(
        "http://localhost:5000/v1/admin/getStoreCount",
        { userId: user._id }, // Truyền đúng userId thay vì selectedUserId
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
        }
      );

      if (response.status === 200) {
        setStoreCount(response.data.storeCount); // Cập nhật số lượng cửa hàng
      }
    } catch (error) {
      console.error("Lỗi khi lấy số lượng cửa hàng:", error.message);
      setStoreCount(0); // Đặt về 0 nếu có lỗi xảy ra
    }
  };

  const openModal = (user) => {
    setSelectedUserId(user._id); // Lưu userId đang được duyệt
    setSelectedDetailUser(user); // Lưu thông tin chi tiết của user từ API getAllUser
    setModalIsOpen(true); // Mở modal
  };

  const closeModal = () => {
    setModalIsOpen(false); // Đóng modal duyệt
    setSelectedUserId(null); // Xóa userId đã lưu
  };

  const closeUserDetailModal = () => {
    setModalUserDetailIsOpen(false); // Đóng modal chi tiết
    setSelectedDetailUser(null); // Xóa thông tin chi tiết
  };

  return (
    <div className="user-container">
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <div className="header">
        <div>
          <h1 className="title">User</h1>
          <p className="welcome-textuser">
            Hi, {user?.fullName}. Welcome back to NOM Admin!
          </p>
        </div>
        <div className="button-group">
          <button className="btn btn-deleteuser">Xoá</button>
          <button className="btn btn-approve">Duyệt chuyển đổi</button>
          <div className="filter-icon-containeruser">
            <FiSliders className="filter-iconuser" />
          </div>
        </div>
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th>
              <label className="custom-checkbox">
                <input type="checkbox" className="checkbox" />
                <span className="checktitle"></span>
              </label>
            </th>
            <th>STT</th>
            <th>
              <div className="divdangnhap" onClick={handleSortClick}>
                <p style={{ width: "80px" }}>Tên đăng nhập</p>
                <FontAwesomeIcon icon={faSort} className="sort-icon" />
              </div>
            </th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
            <th>Gmail</th>
            <th className="filter-header">
              <div className="divdangnhap">
                <p style={{ width: "80px" }}>Trạng thái</p>
                <FontAwesomeIcon
                  icon={faSort}
                  className="sort-icondangnhap"
                  onClick={() => setShowStatusFilter(!showStatusFilter)}
                />
              </div>
            </th>
            <th className="filter-header">
              <div className="divdangnhap">
                <p style={{ width: "100px" }}>Chuyển đổi </p>
                <FontAwesomeIcon
                  icon={faSort}
                  className="sort-icondangnhap"
                  onClick={() => setShowRoleFilter(!showRoleFilter)}
                />
              </div>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user._id}>
                <td>
                  <label className="custom-checkbox">
                    <input type="checkbox" className="checkbox" />
                    <span className="checkmark"></span>
                  </label>
                </td>
                <td>{(currentPage - 1) * 10 + index + 1}</td>
                <td>{user.userName}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.address}</td>
                <td>{user.email}</td>
                <td className="status">
                  {user.isOnline ? (
                    <span className="status online">Đang online</span>
                  ) : (
                    <span className="status offline">Offline</span>
                  )}
                </td>
                <td className="role admin">
                  {user.roleId === "seller" && !user.isApproved ? (
                    <div
                      className="approve-button"
                      style={{ color: "#E53935" }} // Red color for "Chờ duyệt"
                      onClick={() => openModal(user)}
                    >
                      Chờ duyệt
                    </div>
                  ) : user.roleId === "customer" ? (
                    <span style={{ color: "#FFFFFF" }}>Người mua</span> // White color for "Người mua"
                  ) : (
                    <span style={{ color: "#1E90FF" }}>Chủ cửa hàng</span> // Blue color for "Chủ cửa hàng"
                  )}
                </td>

                <td>
                  <button
                    className="menu-button"
                    onClick={() => openUserDetailModal(user)}
                  >
                    ...
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">Không có người dùng</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for approving or rejecting seller */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="custom-modal"
        overlayClassName="custom-modal-overlay"
        shouldCloseOnOverlayClick={true}
      >
        <h2 className="duyetyeucau">Duyệt yêu cầu người bán</h2>
        {selectedDetailUser ? (
          <>
            <p className="modal-info">
              <strong>Tên đại diện:</strong>{" "}
              {selectedDetailUser.representativeName}
            </p>
            <p className="modal-info">
              <strong>CCCD/CMND:</strong> {selectedDetailUser.cccd}
            </p>
            <p className="modal-info">
              <strong>Địa chỉ cửa hàng:</strong>{" "}
              {selectedDetailUser.stores?.[0]?.storeAddress ||
                "Không có thông tin"}
            </p>

            <p className="modal-info">
              <strong>Loại kinh doanh:</strong>{" "}
              {selectedDetailUser.businessType}
            </p>
            <p className="modal-confirmation">
              Bạn có muốn duyệt yêu cầu này không?
            </p>
            <div className="modal-actions">
              <button className="btn-approve1" onClick={handleApprove}>
                Đồng ý
              </button>
              <button className="btn-reject" onClick={handleReject}>
                Từ chối
              </button>
            </div>
          </>
        ) : (
          <p className="modal-loading">Đang tải thông tin...</p>
        )}
      </Modal>

      {/* Modal hiển thị chi tiết người dùng */}
      <Modal
        isOpen={modalUserDetailIsOpen}
        onRequestClose={closeUserDetailModal}
        className="custom-modal1"
        overlayClassName="custom-modal-overlay1"
        shouldCloseOnOverlayClick={true}
      >
        <span className="close-icon" onClick={closeUserDetailModal}>
          <FontAwesomeIcon icon={faCircleXmark} />
        </span>
        {selectedDetailUser && (
          <div className="custom-modal1div">
            <h2 className="thongtinnguoidung">Thông tin chi tiết người dùng</h2>
            <p>
              <span className="thongtinnguoidung1">Tên người dùng </span>
              <span className="red">{selectedDetailUser.userName}</span>
            </p>
            <p>
              <span className="thongtinnguoidung1">Trạng thái </span>
              <span className="common-color">
                {selectedDetailUser.roleId === "customer"
                  ? "Người mua"
                  : selectedDetailUser.roleId === "seller"
                  ? "Người bán"
                  : "Người giao hàng"}
              </span>
              {selectedDetailUser.roleId === "seller" && (
                <p className="store">
                  <span className="thongtinnguoidung1">Số cửa hàng </span>
                  <span className="thongtinnguoidung2">{storeCount}</span>
                </p>
              )}
            </p>

            <p>
              <span className="thongtinnguoidung1">Địa chỉ </span>
              <span className="gray">{selectedDetailUser.address}</span>
            </p>

            <p className="modal-contact">Liên hệ</p>
            <p className="sdtemail">
              <span className="thongtinnguoidung1">Số điện thoại </span>
              <span className="gray1">{selectedDetailUser.phoneNumber}</span>
            </p>
            <p className="sdtemail">
              <span className="thongtinnguoidung1">Gmail </span>
              <span className="gray2">{selectedDetailUser.email}</span>
            </p>
          </div>
        )}
      </Modal>

      {showRoleFilter && (
        <div className="filter-dropdown1">
          <ul>
            <li
              className="dropdown-item"
              onClick={() => handleRoleFilter(null)}
            >
              Tất cả
            </li>
            <li
              className="dropdown-item"
              onClick={() => handleRoleFilter("customer")}
            >
              Người mua
            </li>
            <li
              className="dropdown-item"
              onClick={() => handleRoleFilter("seller")}
            >
              Người bán
            </li>
            <li
              className="dropdown-item"
              onClick={() => handleRoleFilter("shipper")}
            >
              Người giao hàng
            </li>
          </ul>
        </div>
      )}

      {showStatusFilter && (
        <div className="filter-dropdown">
          <ul>
            <li
              className="dropdown-item"
              onClick={() => handleStatusFilter(null)}
            >
              Tất cả
            </li>
            <li
              className="dropdown-item"
              onClick={() => handleStatusFilter(true)}
            >
              Đang online
            </li>
            <li
              className="dropdown-item"
              onClick={() => handleStatusFilter(false)}
            >
              Offline
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default User;
