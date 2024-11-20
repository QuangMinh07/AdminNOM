import React from "react";
import "./OrderDetail.css";

const OrderDetail = ({ oderDetail, onClose }) => {
  if (!oderDetail) return null;

  // Hàm định dạng giá tiền
  const formatCurrency = (amount) => {
    return `${amount.toLocaleString("vi-VN")} VNĐ`;
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
            </tr>
          </thead>
          <tbody>
            {oderDetail.cartSnapshot?.items?.map((item, index) => (
              <tr key={index}>
                <td>{item.foodName}</td>
                <td>{item.quantity}</td>
                <td>{formatCurrency(item.price)} VND</td>
                {item.combos?.foods?.length > 0 && (
                  <div className="combo-details">
                    <p>
                      <strong>Thông tin Combo:</strong>
                    </p>
                    <ul>
                      {item.combos.foods.map((combo, comboIndex) => (
                        <li key={comboIndex}>
                          {combo.foodName} - {formatCurrency(combo.price)} VND
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="danhgia">
          <strong>Điểm thưởng:</strong> {oderDetail.user?.loyaltyPoints || "không có"}
        </p>
        <p className="tongthanhtoan">
          <strong>
            Tổng thanh toán:<span style={{ color: "red", fontWeight: "bold", paddingLeft: 10 }}>{formatCurrency(oderDetail.totalAmount || 0)} VNĐ</span>
          </strong>
        </p>
        <p className="danhgia">
          <strong>Số sao đánh giá:</strong> <strong>không có</strong>
        </p>
        <p className="danhgia">
          <strong>Thông tin đánh giá:</strong> <strong>không có</strong>
        </p>
      </div>
    </div>
  );
};

export default OrderDetail;
