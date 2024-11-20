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
import ProductDetail from "./ProductDetail"; // Import component chi tiết sản phẩm

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
  const [selectedFood, setSelectedFood] = useState(null); // Món ăn được chọn để hiển thị chi tiết
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading
  const [selectedFoodIds, setSelectedFoodIds] = useState([]); // Lưu danh sách các ID được chọn

  const handleCheckboxChange = (foodId) => {
    setSelectedFoodIds(
      (prevSelected) =>
        prevSelected.includes(foodId)
          ? prevSelected.filter((id) => id !== foodId) // Bỏ chọn nếu đã được chọn
          : [...prevSelected, foodId] // Thêm vào danh sách nếu chưa được chọn
    );
  };

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedFoodIds(foods.map((food) => food._id)); // Chọn tất cả
    } else {
      setSelectedFoodIds([]); // Bỏ chọn tất cả
    }
  };

  const openFoodDetail = (food) => {
    setSelectedFood(food); // Mở chi tiết món ăn
  };

  const closeFoodDetail = () => {
    setSelectedFood(null); // Đóng chi tiết món ăn
  };

  const handleDelete = async (food) => {
    if (!food || !food._id) {
      alert("ID món ăn không hợp lệ");
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn xóa món ăn "${food.foodName}" không?`)) {
      setIsLoading(true); // Bật trạng thái loading
      try {
        const response = await api.delete(`/v1/food/delete/${food._id}`); // Gọi API xóa món ăn
        if (response.data.success) {
          alert("Xóa món ăn thành công!");
          setFoods((prevFoods) => prevFoods.filter((item) => item._id !== food._id)); // Cập nhật danh sách món ăn
          closeFoodDetail(); // Đóng modal chi tiết món ăn
        } else {
          alert(response.data.msg || "Có lỗi xảy ra khi xóa món ăn.");
        }
      } catch (error) {
        console.error("Lỗi khi xóa món ăn:", error);
        alert("Lỗi khi xóa món ăn. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false); // Tắt trạng thái loading
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedFoodIds.length === 0) {
      alert("Vui lòng chọn ít nhất một món ăn để xóa!");
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedFoodIds.length} món ăn đã chọn không?`)) {
      setIsLoading(true); // Bật trạng thái loading
      try {
        const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
        if (!token) {
          throw new Error("Token không tồn tại");
        }

        await Promise.all(
          selectedFoodIds.map((id) =>
            api.delete(`/v1/food/delete/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong headers
              },
            })
          )
        );

        alert("Xóa các món ăn thành công!");
        setFoods((prevFoods) => prevFoods.filter((food) => !selectedFoodIds.includes(food._id))); // Cập nhật danh sách
        setSelectedFoodIds([]); // Reset danh sách các mục được chọn
      } catch (error) {
        console.error("Lỗi khi xóa các món ăn:", error);
        alert("Có lỗi xảy ra khi xóa các món ăn.");
      } finally {
        setIsLoading(false); // Tắt trạng thái loading
      }
    }
  };

  const handleWarn = (food) => {
    console.log("Sending warning for food:", food.foodName);
  };

  // API để lấy danh sách món ăn
  const fetchFoods = async (page = 1) => {
    try {
      const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage

      if (!token) {
        throw new Error("Token không tồn tại");
      }

      const response = await api.get("/v1/admin/get-all-food", {
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

  // Lọc món ăn dựa trên trạng thái Đang bán/Ngừng bán
  const filteredFoods = foods.filter((food) => {
    return filterStatus === null || food.isAvailable === filterStatus;
  });

  return (
    <div className="user-containerstore">
      {isLoading && (
        <div className="loading-overlayproduct">
          <div className="spinnerproduct"></div>
        </div>
      )}
      <Helmet>
        <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500&display=swap" rel="stylesheet" />
      </Helmet>
      <div className="headerstore">
        <div>
          <h1 className="titlestore">Product</h1>
          <p className="welcome-textstore">Hi, {user?.fullName}. Welcome back to NOM Admin!</p>
        </div>
        <div className="button-groupstore">
          <button className="btnstore btn-deletestore" onClick={handleDeleteSelected}>
            Xoá
          </button>
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
                <input
                  type="checkbox"
                  className="checkboxstore"
                  checked={selectedFoodIds.length === foods.length} // Nếu tất cả được chọn
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
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
                    <input
                      type="checkbox"
                      className="checkboxstore"
                      checked={selectedFoodIds.includes(food._id)} // Kiểm tra xem mục này đã được chọn chưa
                      onChange={() => handleCheckboxChange(food._id)}
                    />
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
                <td>
                  <button
                    style={{
                      border: "none", // Xóa khung (border)
                      outline: "none", // Xóa outline khi focus
                      background: "transparent", // Loại bỏ màu nền nếu không muốn
                      color: "red", // Màu chữ
                      cursor: "pointer", // Con trỏ dạng tay khi hover
                    }}
                    onClick={() => openFoodDetail(food)}
                  >
                    Chi tiết
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
      {/* Hiển thị chi tiết món ăn */}
      {selectedFood && <ProductDetail foodDetail={selectedFood} onClose={closeFoodDetail} onDelete={handleDelete} onWarn={handleWarn} />}
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

export default Product;
