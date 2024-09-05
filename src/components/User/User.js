import React, { useState, useEffect } from "react"; // Thêm useState, useEffect
import axios from "axios"; // Import axios để gọi API
import "./User.css";
import { FiSliders } from "react-icons/fi"; // Importing the icon from Feather Icons
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";

const User = () => {
  const user = useSelector((state) => state.user.userInfo);

  // Khai báo state để lưu trữ dữ liệu người dùng, số trang hiện tại, và tổng số trang
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async (page = 1) => {
    try {
      const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
      const response = await axios.get(
        `http://localhost:5000/v1/admin/get-all-user`,
        {
          params: {
            page: page,
            limit: 10,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUsers(response.data.data); // Cập nhật danh sách users
        setTotalPages(response.data.totalPages); // Cập nhật tổng số trang
        setCurrentPage(response.data.page); // Cập nhật trang hiện tại
      } else {
        console.error("Error fetching users:", response.data.msg);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Gọi API để lấy tất cả người dùng (cả customer và seller)
  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  return (
    <div className="user-container">
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
              <div className="divdangnhap">
                <p style={{ width: "80px" }}>Tên đăng nhập</p>
                <FontAwesomeIcon icon={faSort} className="sort-icon" />
              </div>
            </th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
            <th>Gmail</th>
            <th>
              <div className="divdangnhap">
                <p style={{ width: "80px" }}>Trạng thái</p>
                <FontAwesomeIcon icon={faSort} className="sort-icondangnhap" />
              </div>
            </th>
            <th>
              <div className="divdangnhap">
                <p style={{ width: "100px" }}>Chuyển đổi </p>
                <FontAwesomeIcon icon={faSort} className="sort-icondangnhap" />
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
                <td className="status online">Đang online</td>
                <td className="role admin">Chủ cửa hàng</td>
                <td>
                  <button className="menu-button">...</button>
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
    </div>
  );
};

export default User;
