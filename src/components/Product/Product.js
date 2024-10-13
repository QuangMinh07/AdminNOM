import React, { useState, useEffect } from "react";
import "./Product.css";
import "./ModalProduct.css";
import { FiSliders } from "react-icons/fi";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import api from "../../api";
import { Helmet } from "react-helmet";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import moment from "moment";

const Product = () => {
  const user = useSelector((state) => state.user.userInfo);
  const [foods, setFoods] = useState([]); // State để lưu danh sách món ăn
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalUserDetailIsOpen, setModalUserDetailIsOpen] = useState(false); // Trạng thái modal chi tiết món ăn
  const [selectedDetailFood, setSelectedDetailFood] = useState(null); // Lưu thông tin món ăn được chọn để hiển thị chi tiết
  const [sortField, setSortField] = useState("foodName"); // Mặc định sắp xếp theo tên món ăn
  const [sortOrder, setSortOrder] = useState("asc"); // Mặc định sắp xếp tăng dần
  const [filterStatus, setFilterStatus] = useState(null); // Lọc theo trạng thái (Đang bán, Ngừng bán)
  const [showStatusFilter, setShowStatusFilter] = useState(false);

  // API để lấy danh sách món ăn
  const fetchFoods = async (page = 1) => {
    try {
      const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage

      if (!token) {
        throw new Error("Token không tồn tại");
      }

      const response = await api.get("/v1/food/getAllfood", {
        params: {
          page: page,
          limit: 10,
          sortField: sortField,
          sortOrder: sortOrder,
          isAvailable: filterStatus,
        },
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong headers
        },
      });

      if (response.data.foods) {
        setFoods(response.data.foods); // Lưu danh sách món ăn vào state
        setTotalPages(response.data.totalPages); // Cập nhật tổng số trang
        setCurrentPage(response.data.currentPage); // Cập nhật trang hiện tại
      } else {
        console.error("Error fetching foods:", response.data.msg);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    fetchFoods(currentPage); // Gọi API để lấy danh sách món ăn
  }, [currentPage, sortField, sortOrder, filterStatus]);

  // Hàm xử lý sắp xếp tên món ăn
  const handleSortClick = (field) => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc")); // Đảo ngược thứ tự sắp xếp
    setSortField(field); // Cập nhật trường sắp xếp
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
    setShowStatusFilter(false);
  };

  // Hàm mở modal chi tiết món ăn khi nhấn vào dấu ba chấm
  const openFoodDetailModal = (food) => {
    setSelectedDetailFood({
      foodName: food.foodName,
      storeName: food.store,
      foodGroup: food.foodGroup,
      price: food.price,
      description: food.description,
      imageUrl: food.imageUrl,
      sellingTime: food.sellingTime,
    });

    setModalUserDetailIsOpen(true);
  };

  const closeFoodDetailModal = () => {
    setModalUserDetailIsOpen(false); // Đóng modal chi tiết
    setSelectedDetailFood(null); // Xóa thông tin chi tiết
  };

  // Lọc món ăn dựa trên trạng thái Đang bán/Ngừng bán
  const filteredFoods = foods.filter((food) => {
    return filterStatus === null || food.isAvailable === filterStatus;
  });

  return (
    <div className="user-containerstore">
      <Helmet>
        <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500&display=swap" rel="stylesheet" />
      </Helmet>
      <div className="headerstore">
        <div>
          <h1 className="titlestore">Product</h1>
          <p className="welcome-textstore">Hi, {user?.fullName}. Welcome back to NOM Admin!</p>
        </div>
        <div className="button-groupstore">
          <button className="btnstore btn-deletestore">Xoá</button>
          <button className="btnstore btn-approvestore">Gửi cảnh báo</button>
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
              <div className="divdangnhapstore" onClick={() => handleSortClick("foodName")}>
                <p style={{ width: "130px" }}>Tên Sản Phẩm</p>
                <FontAwesomeIcon icon={faSort} className="sort-iconstore" />
              </div>
            </th>
            <th>
              <div className="divdangnhap" onClick={() => handleSortClick("foodGroup")}>
                <p style={{ width: "130px" }}>Tên nhóm món</p>
                <FontAwesomeIcon icon={faSort} className="sort-iconstore" />
              </div>
            </th>
            <th>
              <div className="divdangnhap" onClick={() => handleSortClick("price")}>
                <p style={{ width: "130px" }}>Giá Món ăn</p>
                <FontAwesomeIcon icon={faSort} className="sort-iconstore" />
              </div>
            </th>
            <th>
              <div className="divdangnhap" onClick={() => handleSortClick("store")}>
                <p style={{ width: "130px" }}>Tên Cửa Hàng</p>
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
                <p style={{ width: "100px" }}>Xem Thêm</p>
                <FontAwesomeIcon icon={faSort} className="sort-icondangnhapstore" />
              </div>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredFoods.length > 0 ? (
            filteredFoods.map((food, index) => (
              <tr key={food._id}>
                <td>
                  <label className="custom-checkboxstore">
                    <input type="checkbox" className="checkboxstore" />
                    <span className="checkmarkstore"></span>
                  </label>
                </td>
                <td>{(currentPage - 1) * 10 + index + 1}</td>
                <td>{food.foodName}</td>
                <td>{food.foodGroup}</td>
                <td>{food.price}</td>
                <td>{food.store}</td>
                <td className="statusstore">{food.isAvailable ? <span className="status online">Đang bán</span> : <span className="status offline">Ngừng bán</span>}</td>
                {/* <td>{food.createdAt ? moment(food.createdAt).format("DD/MM/YYYY") : "Không có ngày tạo"}</td> */}
                <td style={{ color: "red" }}>Chi tiết</td>
                <td>
                  <button className="menu-buttonstore" onClick={() => openFoodDetailModal(food)}>
                    ...
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">Không có món ăn</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal hiển thị chi tiết món ăn */}
      <Modal isOpen={modalUserDetailIsOpen} onRequestClose={closeFoodDetailModal} className="custom-modal1" overlayClassName="custom-modal-overlay1" shouldCloseOnOverlayClick={true}>
        <span className="close-iconstore" onClick={closeFoodDetailModal}>
          <FontAwesomeIcon icon={faCircleXmark} />
        </span>

        {selectedDetailFood && (
          <div className="custom-modal1divstore">
            <h2 className="thongtinnguoidungstore">Thông tin chi tiết món ăn</h2>
            <p>
              <span className="thongtinnguoidung1store">Tên món ăn </span>
              <span className="red">{selectedDetailFood.foodName}</span>
            </p>
            <p>
              <span className="thongtinnguoidung1store">Giá </span>
              <span className="green">{selectedDetailFood.price}</span>
            </p>
            <div className="custom-modal1divstore1">
              <p>
                <span className="thongtinnguoidung1store">Tên cửa hàng </span>
                <span className="tencuahang">{selectedDetailFood.storeName}</span>
              </p>
              <p>
                <span className="thongtinnguoidung1store">Nhóm món </span>
                <span className="stylechung">{selectedDetailFood.foodGroup}</span>
              </p>
              <p>
                <span className="thongtinnguoidung1store">Mô tả </span>
                <span className="stylechung">{selectedDetailFood.description}</span>
              </p>
            </div>
          </div>
        )}
      </Modal>

      {showStatusFilter && (
        <div className="filter-dropdownproduct">
          <ul>
            <li className="dropdown-itemstore" onClick={() => handleStatusFilter(null)}>
              Tất cả
            </li>
            <li className="dropdown-itemstore" onClick={() => handleStatusFilter(true)}>
              Đang bán
            </li>
            <li className="dropdown-itemstore" onClick={() => handleStatusFilter(false)}>
              Ngừng bán
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Product;
