import React, { useState, useEffect } from "react";
import "./OrderDetail.css";
import api from "../../api"; // Import module API của bạn

const OrderDetail = ({ oderDetail, onClose }) => {
  const [review, setReview] = useState(null); // State lưu thông tin đánh giá
  const [loadingReview, setLoadingReview] = useState(false); // State để hiển thị trạng thái tải

  useEffect(() => {
    if (oderDetail?.orderId) {
      fetchReview(oderDetail.orderId); // Gọi API để lấy thông tin đánh giá
    }
  }, [oderDetail]);

  const fetchReview = async (orderId) => {
    setLoadingReview(true);
    try {
      const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
      const response = await api.get(`/v1/admin/get-review/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReview(response.data.review); // Lưu dữ liệu đánh giá vào state
    } catch (error) {
      console.error("Lỗi khi lấy thông tin đánh giá:", error.message);
      setReview(null); // Nếu không có đánh giá, để null
    } finally {
      setLoadingReview(false); // Tắt trạng thái tải
    }
  };

  if (!oderDetail) return null;

  // Hàm định dạng giá tiền
  const formatCurrency = (amount) => {
    return `${amount.toLocaleString("vi-VN")} `;
  };

  return (
    <div className="order-detail-container">
      {/* Header */}
      <div className="order-detail-header">
        <h2 style={{ paddingLeft: 350 }}>Thông tin đơn hàng</h2>
        <button className="close-button" onClick={onClose}>
          Đóng
        </button>
      </div>

      {/* Content */}
      <div className="order-detail-content">
        <div className="order-summary-header">
          <div className="order-left">
            <p>
              <strong>
                Mã Đơn Hàng:<span className="custom-order-full">{oderDetail.orderId || "Không có"}</span>
              </strong>
            </p>
            <p>
              <strong>
                Tên người Mua: <span className="custom-order-full">{oderDetail.user?.fullName || "Không có"}</span>
              </strong>
            </p>
            <p>
              <strong>
                Tên người bán: <span className="custom-order-full">{oderDetail.store?.storeName || "Không rõ cửa hàng"}</span>
              </strong>
            </p>
            <p>
              <strong>
                Tên người giao hàng: <span className="custom-order-full">{oderDetail.shipper?.fullName || "Không có"}</span>
              </strong>
            </p>
          </div>
          <div className="order-right" style={{ paddingLeft: 20 }}>
            <p>
              <strong>
                Trạng thái: <span style={{ paddingLeft: 10 }}>{oderDetail.orderStatus === "Pending" ? <span className="status-pending">Chờ xử lý</span> : oderDetail.orderStatus === "Processing" ? <span className="status-processing">Đang chuẩn bị</span> : oderDetail.orderStatus === "Shipped" ? <span className="status-shipped">Shipper đã chấp nhận giao đơn hàng</span> : oderDetail.orderStatus === "Completed" ? <span className="status-completed">Đang hoàn thành đơn hàng</span> : oderDetail.orderStatus === "Received" ? <span className="status-received">Đang giao</span> : oderDetail.orderStatus === "Delivered" ? <span className="status-delivered">Hoàn thành</span> : oderDetail.orderStatus === "Cancelled" ? <span className="status-cancelled">Đã hủy</span> : <span className="status-unknown">Không xác định</span>}</span>
              </strong>
            </p>
            <p>
              <strong>
                Địa chỉ: <span className="custom-order-full">{oderDetail.cartSnapshot.deliveryAddress || "Không có"}</span>
              </strong>
            </p>
          </div>
          <div className="order-right">
            <p style={{ color: "red" }}>
              <strong>
                Ngày đặt đơn:
                <span style={{ marginLeft: 10 }}>{new Date(oderDetail.orderDate).toLocaleDateString() || "Không có"}</span>
              </strong>
            </p>
          </div>
        </div>
        <h3 className="section-header">Chi tiết đơn hàng</h3>
        <table className="order-items">
          <thead>
            <tr>
              <th>Thông tin món ăn</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Thông tin Combo</th>
              <th>Giá tiền Combo</th>
            </tr>
          </thead>
          <tbody>
            {oderDetail.cartSnapshot?.items?.map((item, index) => (
              <tr key={index}>
                <td>{item.foodName}</td>
                <td>{item.quantity}</td>
                <td>{formatCurrency(item.price)} VND</td>
                <td>
                  {item.combos?.foods?.length > 0 && (
                    <div className="combo-details">
                      <ul>
                        {item.combos.foods.map((combo, comboIndex) => (
                          <li key={comboIndex}>{combo.foodName}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </td>
                <td>
                  {item.combos?.foods?.length > 0 && (
                    <div className="combo-details">
                      <ul>
                        {item.combos.foods.map((combo, comboIndex) => (
                          <li key={comboIndex}>{formatCurrency(combo.price)} VND</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="danhgia">
          <strong>Điểm thưởng:</strong> {oderDetail.loyaltyPointsUsed || "không có"}
        </p>
        <p className="tongthanhtoan">
          <strong>
            Tổng thanh toán:<span style={{ color: "red", fontWeight: "bold", paddingLeft: 10 }}>{formatCurrency(oderDetail.totalAmount || 0)} VNĐ</span>
          </strong>
        </p>
        <h3 className="section-header">Đánh giá:</h3>
        {loadingReview ? (
          <p>Đang tải thông tin đánh giá...</p>
        ) : review ? (
          <div className="danhgia">
            <p>
              <strong>Số sao đánh giá:</strong> {review.rating}
            </p>
            <p>
              <strong>Bình luận:</strong> {review.comment}
            </p>
          </div>
        ) : (
          <p>Không có đánh giá cho đơn hàng này.</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
