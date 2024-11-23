import React, { useState, useEffect } from "react";
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
import { ClipLoader } from "react-spinners"; // Thêm thư viện loading spinner

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
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading
  const [selectedUsers, setSelectedUsers] = useState([]); // Lưu danh sách userId đã chọn
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false); // Trạng thái mở modal xác nhận xóa
  const [deleteImmediately, setDeleteImmediately] = useState(false); // Loại xóa (ngay lập tức hoặc chờ)

  const handleOpenDeleteModal = (immediate) => {
    setDeleteImmediately(immediate);
    setIsConfirmDeleteModalOpen(true);
  };

  const fetchUsers = async (page = 1) => {
    try {
      const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
      console.log("Token from localStorage:", token);

      if (!token) {
        throw new Error("Token không tồn tại");
      }

      const response = await api.get("/v1/admin/get-all-user", {
        params: {
          page: page,
          limit: 10,
          sortField: sortField,
          sortOrder: sortOrder,
          isOnline: filterStatus,
          role: filterRole,
        },
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong headers
        },
      });

      if (response.data.success) {
        setUsers(response.data.data);
        console.log("Fetched users:", response.data.data);

        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.page);
      } else {
        console.error("Error fetching users:", response.data.msg);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleConfirmDelete = async () => {
    setIsConfirmDeleteModalOpen(false); // Đóng modal

    try {
      setLoading(true);
      const response = await api.post("/v1/admin/delete-user", {
        userIds: selectedUsers,
        deleteImmediately,
      });

      if (response.data.success) {
        alert(response.data.message);
        fetchUsers(); // Cập nhật danh sách người dùng
        setSelectedUsers([]);
      } else {
        console.error("Error:", response.data.message);
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting users:", error.message);
      alert("Đã xảy ra lỗi khi xử lý người dùng.");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi chọn/deselect checkbox của từng người dùng
  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter((id) => id !== userId); // Bỏ userId nếu đã chọn
      } else {
        return [...prevSelectedUsers, userId]; // Thêm userId nếu chưa chọn
      }
    });
  };

  // Xử lý khi chọn/deselect tất cả checkbox
  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]); // Bỏ chọn tất cả
    } else {
      setSelectedUsers(users.map((user) => user._id)); // Chọn tất cả
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
      setIsLoading(true); // Bắt đầu loading
      let apiEndpoint = "";

      if (selectedDetailUser.roleId === "seller") {
        apiEndpoint = "/v1/admin/approve-seller";
      } else if (selectedDetailUser.roleId === "shipper") {
        apiEndpoint = "/v1/admin/approve-shipper";
      }

      const response = await api.post(apiEndpoint, { userId: selectedUserId });

      if (response.data.message) {
        alert("Người dùng đã được duyệt thành công!");
        fetchUsers(); // Làm mới danh sách người dùng
        closeModal(); // Đóng modal
      }
    } catch (error) {
      console.error("Error approving user:", error.message);
      alert("Lỗi khi duyệt người dùng");
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  const handleReject = async () => {
    try {
      setIsLoading(true); // Bắt đầu loading
      let apiEndpoint = "";

      if (selectedDetailUser.roleId === "seller") {
        apiEndpoint = "/v1/admin/reject-seller";
      } else if (selectedDetailUser.roleId === "shipper") {
        apiEndpoint = "/v1/admin/reject-shipper";
      }

      const response = await api.post(apiEndpoint, { userId: selectedUserId });

      if (response.data.message) {
        alert("Người dùng đã bị từ chối và chuyển thành customer.");
        fetchUsers(); // Làm mới danh sách người dùng
        closeModal(); // Đóng modal
      }
    } catch (error) {
      console.error("Error rejecting user:", error.message);
      alert("Lỗi khi từ chối người dùng");
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  // Hàm mở modal chi tiết người dùng khi nhấn vào dấu ba chấm
  const openUserDetailModal = async (user) => {
    setSelectedDetailUser(user);
    setModalUserDetailIsOpen(true);

    try {
      const response = await api.post("/v1/admin/getStoreCount", { userId: user._id });

      if (response.status === 200) {
        setStoreCount(response.data.storeCount);
      }
    } catch (error) {
      console.error("Lỗi khi lấy số lượng cửa hàng:", error.message);
      setStoreCount(0);
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
      {loading && (
        <div className="loading-overlayuser">
          <div className="spinneruser"></div>
        </div>
      )}
      <Helmet>
        <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500&display=swap" rel="stylesheet" />
      </Helmet>
      <div className="header">
        <div>
          <h1 className="title">User</h1>
          <p className="welcome-textuser">Hi, {user?.fullName}. Welcome back to NOM Admin!</p>
        </div>
        <div className="button-group">
          <button className="btn btn-deleteuser" onClick={() => handleOpenDeleteModal(true)}>
            Xóa ngay lập tức
          </button>
          <button className="btn btn-deleteuser" onClick={() => handleOpenDeleteModal(false)}>
            Đặt trạng thái chờ xóa
          </button>
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
                <input type="checkbox" className="checkbox" onChange={handleSelectAll} checked={selectedUsers.length === users.length && users.length > 0} />
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
                <FontAwesomeIcon icon={faSort} className="sort-icondangnhap" onClick={() => setShowStatusFilter(!showStatusFilter)} />
              </div>
            </th>

            <th className="filter-header">
              <div className="divdangnhap">
                <p style={{ width: "100px" }}>Chuyển đổi </p>
                <FontAwesomeIcon icon={faSort} className="sort-icondangnhap" onClick={() => setShowRoleFilter(!showRoleFilter)} />
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
                    <input type="checkbox" className="checkbox" onChange={() => handleCheckboxChange(user._id)} checked={selectedUsers.includes(user._id)} />
                    <span className="checkmark"></span>
                  </label>
                </td>
                <td>{(currentPage - 1) * 10 + index + 1}</td>
                <td>{user.userName}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.address}</td>
                <td>{user.email}</td>
                <td className="status">{user.isOnline ? <span className="status online">Đang online</span> : <span className="status offline">Offline</span>}</td>
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
                  ) : user.roleId === "shipper" && !user.isApproved ? ( // Điều kiện cho "Chờ duyệt" cho shipper
                    <div
                      className="approve-button"
                      style={{ color: "#E53935" }} // Red color for "Chờ duyệt"
                      onClick={() => openModal(user)}
                    >
                      Chờ duyệt (Shipper)
                    </div>
                  ) : user.roleId === "shipper" ? (
                    <span style={{ color: "#32CD32" }}>Người giao hàng</span> // Green color for "Người giao hàng"
                  ) : user.roleId === "staff" ? (
                    <span style={{ color: "#32CD32" }}>Nhân viên</span>
                  ) : (
                    <span style={{ color: "#1E90FF" }}>Chủ cửa hàng</span> // Blue color for "Chủ cửa hàng"
                  )}
                </td>

                <td>
                  <button className="menu-button" onClick={() => openUserDetailModal(user)}>
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

      {/* Modal for approving or rejecting user */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="custom-modal" overlayClassName="custom-modal-overlay" shouldCloseOnOverlayClick={true}>
        <h2 className="duyetyeucau">{selectedDetailUser?.roleId === "seller" ? "Duyệt yêu cầu người bán" : selectedDetailUser?.roleId === "shipper" ? "Duyệt yêu cầu người giao hàng" : "Duyệt yêu cầu người dùng"}</h2>

        {selectedDetailUser ? (
          <>
            {/* Hiển thị thông tin dựa theo roleId */}
            <p className="modal-info">
              <strong>{selectedDetailUser.roleId === "seller" ? "Tên đại diện: " : "Họ và Tên: "}</strong>
              {selectedDetailUser.roleId === "seller" ? selectedDetailUser.representativeName : selectedDetailUser.fullName}
            </p>

            <p className="modal-info">
              <strong>CCCD/CMND: </strong>
              {selectedDetailUser.cccd || "Không có thông tin"}
            </p>

            <p className="modal-info">
              <strong>{selectedDetailUser.roleId === "seller" ? "Địa chỉ cửa hàng: " : "Địa chỉ: "}</strong>
              {selectedDetailUser.roleId === "seller" ? (selectedDetailUser.storeIds.length > 0 ? selectedDetailUser.storeIds[0].storeAddress : "Không có thông tin") : selectedDetailUser.address || "Không có thông tin"}
            </p>

            {/* Thông tin bổ sung cho seller */}
            {selectedDetailUser.roleId === "seller" && (
              <>
                <p className="modal-info">
                  <strong>Loại kinh doanh: </strong>
                  {selectedDetailUser.businessType || "Không có thông tin"}
                </p>
              </>
            )}

            {/* Thông tin bổ sung cho shipper */}
            {selectedDetailUser.roleId === "shipper" && (
              <>
                <p className="modal-info">
                  <strong>Mã số xe: </strong>
                  {selectedDetailUser.shipperInfo?.vehicleNumber || "Không có thông tin"}
                </p>
                <p className="modal-info">
                  <strong>Địa chỉ tạm trú: </strong>
                  {selectedDetailUser.shipperInfo?.temporaryAddress || "Không có thông tin"}
                </p>
                <p className="modal-info">
                  <strong>Số tài khoản ngân hàng: </strong>
                  {selectedDetailUser.shipperInfo?.bankAccount || "Không có thông tin"}
                </p>
              </>
            )}

            <p className="modal-confirmation">Bạn có muốn duyệt yêu cầu này không?</p>

            {/* Actions for approval or rejection */}
            <div className="modal-actions">
              {isLoading ? (
                <ClipLoader size={30} color={"#123abc"} loading={isLoading} /> // Hiển thị loading spinner
              ) : (
                <>
                  <button className="btn-approve1" onClick={handleApprove}>
                    Đồng ý
                  </button>
                  <button className="btn-reject" onClick={handleReject}>
                    Từ chối
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <p className="modal-loading">Đang tải thông tin...</p>
        )}
      </Modal>

      {/* Modal hiển thị chi tiết người dùng */}
      <Modal isOpen={modalUserDetailIsOpen} onRequestClose={closeUserDetailModal} className="custom-modal1" overlayClassName="custom-modal-overlay1" shouldCloseOnOverlayClick={true}>
        <span className="close-icon" onClick={closeUserDetailModal}>
          <FontAwesomeIcon icon={faCircleXmark} />
        </span>
        {selectedDetailUser && (
          <div className="custom-modal1div">
            <h2 className="thongtinnguoidung">Thông tin chi tiết người dùng</h2>

            {/* Thêm đoạn code hiển thị trạng thái ở đây */}
            <p>
              <span className="thongtinnguoidung1">Trạng thái </span>
              <span className="common-color">{selectedDetailUser.roleId === "customer" ? "Người mua" : selectedDetailUser.roleId === "seller" ? "Người bán" : selectedDetailUser.roleId === "staff" ? "Nhân viên" : "Người giao hàng"}</span>
              {selectedDetailUser.roleId === "seller" && (
                <p className="store">
                  <span className="thongtinnguoidung1">Số cửa hàng </span>
                  <span className="thongtinnguoidung2">{storeCount}</span>
                </p>
              )}
              {selectedDetailUser.roleId === "shipper" && (
                <p className="store">
                  <span className="thongtinnguoidung4">Mã số xe </span>
                  <span className="thongtinnguoidung3">{selectedDetailUser.shipperInfo?.vehicleNumber}</span>
                </p>
              )}
            </p>

            {/* Các thông tin khác của người dùng */}
            <p>
              <span className="thongtinnguoidung1">Tên người dùng </span>
              <span className="red">{selectedDetailUser.fullName}</span>
            </p>
            {selectedDetailUser.roleId === "shipper" && (
              <p>
                <span className="thongtinnguoidung1">Địa chỉ </span>
                <span className="gray">{selectedDetailUser.shipperInfo?.temporaryAddress}</span>
              </p>
            )}
            {/* Thông tin liên hệ */}
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
            <li className="dropdown-item" onClick={() => handleRoleFilter(null)}>
              Tất cả
            </li>
            <li className="dropdown-item" onClick={() => handleRoleFilter("customer")}>
              Người mua
            </li>
            <li className="dropdown-item" onClick={() => handleRoleFilter("seller")}>
              Người bán
            </li>
            <li className="dropdown-item" onClick={() => handleRoleFilter("shipper")}>
              Người giao hàng
            </li>
            <li className="dropdown-item" onClick={() => handleRoleFilter("staff")}>
              Nhân viên
            </li>
          </ul>
        </div>
      )}

      {showStatusFilter && (
        <div className="filter-dropdown">
          <ul>
            <li className="dropdown-item" onClick={() => handleStatusFilter(null)}>
              Tất cả
            </li>
            <li className="dropdown-item" onClick={() => handleStatusFilter(true)}>
              Đang online
            </li>
            <li className="dropdown-item" onClick={() => handleStatusFilter(false)}>
              Offline
            </li>
          </ul>
        </div>
      )}

      <Modal isOpen={isConfirmDeleteModalOpen} onRequestClose={() => setIsConfirmDeleteModalOpen(false)} className="delete-user-modal" overlayClassName="delete-user-modal-overlay">
        <h2 className="delete-user-modal-title">Xác nhận xóa</h2>
        <p className="delete-user-modal-message">{deleteImmediately ? "Bạn có chắc chắn muốn xóa ngay lập tức những người dùng đã chọn?" : "Bạn có chắc chắn muốn đặt trạng thái chờ xóa cho những người dùng đã chọn?"}</p>
        <div className="delete-user-modal-actions">
          <button className="delete-user-modal-btn-confirm" onClick={handleConfirmDelete}>
            Xác nhận
          </button>
          <button className="delete-user-modal-btn-cancel" onClick={() => setIsConfirmDeleteModalOpen(false)}>
            Hủy
          </button>
        </div>
      </Modal>

      <div className="pagination">
        <button
          className="pagination-button"
          disabled={currentPage === 1 || totalPages === 1} // Nút "Trước" bị vô hiệu nếu ở trang đầu tiên hoặc chỉ có một trang
          onClick={() => {
            setCurrentPage((prev) => {
              const newPage = Math.max(prev - 1, 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
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
              const newPage = Math.min(prev + 1, totalPages);
              window.scrollTo({ top: 0, behavior: "smooth" });
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

export default User;
