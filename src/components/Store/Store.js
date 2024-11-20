import React, { useState, useEffect } from "react";
import "./Store.css";
import "./ModalStore.css";
import { FiSliders } from "react-icons/fi";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import api from "../../api";
import { Helmet } from "react-helmet";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import moment from "moment";

const Store = () => {
  const user = useSelector((state) => state.user.userInfo);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalUserDetailIsOpen, setModalUserDetailIsOpen] = useState(false); // Trạng thái modal chi tiết người dùng
  const [selectedDetailUser, setSelectedDetailUser] = useState(null); // Lưu thông tin người dùng được chọn để hiển thị chi tiết
  const [sortField, setSortField] = useState("userName"); // Mặc định sắp xếp theo tên
  const [sortOrder, setSortOrder] = useState("asc"); // Mặc định sắp xếp tăng dần
  const [filterStatus, setFilterStatus] = useState(null); // Lọc theo trạng thái (online, offline)
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [storeCount, setStoreCount] = useState(0); // Thêm state để lưu số lượng cửa hàng
  const [stores, setStores] = useState([]); // Thêm state để lưu danh sách cửa hàng

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
        },
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong headers
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
      console.error("Error:", error.message);
    }
  };

  const fetchStores = async (page = 1) => {
    try {
      const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage

      if (!token) {
        throw new Error("Token không tồn tại");
      }

      const response = await api.get("/v1/admin/get-all-store", {
        params: {
          page: page,
          limit: 10,
          sortField: sortField, // Gửi trường sắp xếp
          sortOrder: sortOrder, // Gửi thứ tự sắp xếp
        },
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong headers
        },
      });

      if (response.data.success) {
        setStores(response.data.data); // Lưu danh sách cửa hàng vào state
        setTotalPages(response.data.totalPages); // Cập nhật tổng số trang
      } else {
        console.error("Error fetching stores:", response.data.msg);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
    fetchStores(currentPage); // Gọi API để lấy danh sách cửa hàng
  }, [currentPage, sortField, sortOrder, filterStatus]);

  // Hàm xử lý sắp xếp tên đăng nhập
  const handleSortClick = (field) => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc")); // Đảo ngược thứ tự sắp xếp
    setSortField(field); // Cập nhật trường sắp xếp
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
    setShowStatusFilter(false);
  };

  // Hàm mở modal chi tiết người dùng khi nhấn vào dấu ba chấm
  const openUserDetailModal = async (user, store) => {
    setSelectedDetailUser({
      ...user,
      storeName: store.storeName,
      productCount: store.productCount,
      storeAddress: store.storeAddress,
    });

    setModalUserDetailIsOpen(true);

    try {
      const response = await api.post("/v1/admin/getStoreCount", {
        userId: user._id,
      });

      if (response.status === 200) {
        setStoreCount(response.data.storeCount);
      }
    } catch (error) {
      console.error("Lỗi khi lấy số lượng cửa hàng:", error.message);
      setStoreCount(0);
    }
  };

  const closeUserDetailModal = () => {
    setModalUserDetailIsOpen(false); // Đóng modal chi tiết
    setSelectedDetailUser(null); // Xóa thông tin chi tiết
  };

  // Lọc các cửa hàng dựa trên trạng thái online/offline của chủ cửa hàng
  const filteredStores = stores.filter((store) => {
    // Lọc cửa hàng dựa trên trạng thái isOpen của store
    return filterStatus === null || store.isOpen === filterStatus;
  });

  return (
    <div className="user-containerstore">
      <Helmet>
        <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500&display=swap" rel="stylesheet" />
      </Helmet>
      <div className="headerstore">
        <div>
          <h1 className="titlestore">Store</h1>
          <p className="welcome-textstore">Hi, {user?.fullName}. Welcome back to NOM Admin!</p>
        </div>
        <div className="button-groupstore">
          <button className="btnstore btn-deletestore">Xoá</button>
          <button className="btnstore btn-approvestore">Hủy chuyển đổi</button>
          <div className="filter-icon-containerstore">
            <FiSliders className="filter-iconstore" />
          </div>
        </div>
      </div>
      <table className="user-tablestore">
        <thead>
          <tr>
            <th>
              <label className="custom-checkboxstore">
                <input type="checkbox" className="checkboxstore" />
                <span className="checktitlestore"></span>
              </label>
            </th>
            <th>STT</th>
            <th>
              <div className="divdangnhapstore" onClick={() => handleSortClick("storeName")}>
                <p style={{ width: "130px" }}>Tên cửa hàng</p>
                <FontAwesomeIcon icon={faSort} className="sort-iconstore" />
              </div>
            </th>
            <th>
              <div className="divdangnhap" onClick={() => handleSortClick("owner.representativeName")}>
                <p style={{ width: "130px" }}>Người sở hữu</p>
                <FontAwesomeIcon icon={faSort} className="sort-iconstore" />
              </div>
            </th>
            <th>
              <div className="divdangnhap" onClick={() => handleSortClick("owner.storeCount")}>
                <p style={{ width: "130px" }}>Số cửa hàng</p>
                <FontAwesomeIcon icon={faSort} className="sort-iconstore" />
              </div>
            </th>
            <th>
              <div className="divdangnhap" onClick={() => handleSortClick("productCount")}>
                <p style={{ width: "130px" }}>Số sản phẩm</p>
                <FontAwesomeIcon icon={faSort} className="sort-iconstore" />
              </div>
            </th>
            <th className="filter-header">
              <div className="divdangnhap">
                <p style={{ width: "80px" }}>Trạng thái</p>
                <FontAwesomeIcon icon={faSort} className="sort-icondangnhapstore" onClick={() => setShowStatusFilter(!showStatusFilter)} />
              </div>
            </th>
            <th className="filter-header">
              <div className="divdangnhap" onClick={() => handleSortClick("createdAt")}>
                <p style={{ width: "100px" }}>Ngày tạo</p>
                <FontAwesomeIcon icon={faSort} className="sort-icondangnhapstore" />
              </div>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredStores.length > 0 ? (
            filteredStores.map((store, index) => (
              <tr key={store._id}>
                <td>
                  <label className="custom-checkboxstore">
                    <input type="checkbox" className="checkboxstore" />
                    <span className="checkmarkstore"></span>
                  </label>
                </td>
                <td>{(currentPage - 1) * 10 + index + 1}</td>
                <td>{store.storeName}</td>
                <td>{store.owner ? store.owner.representativeName : "Không có chủ sở hữu"}</td>
                <td>{store.owner ? store.owner.storeCount : "Không có số cửa hàng"}</td>
                <td>{store.productCount}</td>
                <td className="statusstore">{store.isOpen ? <span className="status online">Đang mở</span> : <span className="status offline">Đóng cửa</span>}</td>
                <td>{store.createdAt ? moment(store.createdAt).format("DD/MM/YYYY") : "Không có ngày tạo"}</td>
                <td>
                  <button className="menu-buttonstore" onClick={() => openUserDetailModal(store.owner, store)}>
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

      {/* Modal hiển thị chi tiết người dùng */}
      <Modal isOpen={modalUserDetailIsOpen} onRequestClose={closeUserDetailModal} className="custom-modal1" overlayClassName="custom-modal-overlay1" shouldCloseOnOverlayClick={true}>
        <span className="close-iconstore" onClick={closeUserDetailModal}>
          <FontAwesomeIcon icon={faCircleXmark} />
        </span>

        {selectedDetailUser && (
          <div className="custom-modal1divstore">
            <h2 className="thongtinnguoidungstore">Thông tin chi tiết người dùng</h2>
            <p>
              <span className="thongtinnguoidung1store">Tên người dùng </span>
              <span className="red">{selectedDetailUser.representativeName}</span>
            </p>
            <p>
              <span className="thongtinnguoidung1store">Số lượng cửa hàng </span>
              <span className="green">{selectedDetailUser.storeCount}</span>
            </p>
            <div className="custom-modal1divstore1">
              <p>
                <span className="thongtinnguoidung1store">Tên cửa hàng </span>
                <span className="tencuahang">{selectedDetailUser.storeName}</span>
              </p>
              <p>
                <span className="thongtinnguoidung1store">Địa chỉ </span>
                <span className="stylechung">{selectedDetailUser.storeAddress}</span>
              </p>
              <p>
                <span className="thongtinnguoidung1store">Số lượng sản phẩm </span>
                <span className="stylechung">{selectedDetailUser.productCount}</span>
              </p>
              <p>
                <span className="thongtinnguoidung1store">Mô Hình Kinh Doanh </span>
                <span className="stylechung">{selectedDetailUser.businessType}</span>
              </p>
            </div>
          </div>
        )}
      </Modal>

      {showStatusFilter && (
        <div className="filter-dropdownstore">
          <ul>
            <li className="dropdown-itemstore" onClick={() => handleStatusFilter(null)}>
              Tất cả
            </li>
            <li className="dropdown-itemstore" onClick={() => handleStatusFilter(true)}>
              Đang mở
            </li>
            <li className="dropdown-itemstore" onClick={() => handleStatusFilter(false)}>
              Đóng cửa
            </li>
          </ul>
        </div>
      )}

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

export default Store;
