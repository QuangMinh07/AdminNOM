import React from "react";
import "./ProductDetail.css";

const ProductDetail = ({ foodDetail, onClose, onDelete, onWarn }) => {
  if (!foodDetail) return null;

  return (
    <div className="product-detail-container">
      {/* Header */}
      <div className="product-detail-header">
        <h2>Thông tin chi tiết sản phẩm</h2>
        <button className="close-button" onClick={onClose}>
          Đóng
        </button>
      </div>

      {/* Content */}
      <div className="product-detail-content">
        <p>
          <strong>Tên sản phẩm:</strong> {foodDetail.foodName || "N/A"}
        </p>
        <p>
          <strong>Nhóm:</strong> {foodDetail.foodGroup || "N/A"}
        </p>
        <p>
          <strong>Cửa hàng:</strong>
          <span className="store-name">{foodDetail.store.storeName || "N/A"}</span>
        </p>
        <p>
          <strong>Giá:</strong> {foodDetail.price || "N/A"} VND
        </p>
        <p>
          <strong>Mô tả:</strong> {foodDetail.description || "Không có mô tả"}
        </p>
        <p>
          <strong>Ảnh:</strong>
        </p>
        <img src={foodDetail.imageUrl} alt="Product" className="product-image" />
      </div>

      {/* Footer (Action Buttons) */}
      <div className="action-buttons">
        <button className="delete-button" onClick={() => onDelete(foodDetail)}>
          Xóa món
        </button>
        <button className="warn-button" onClick={() => onWarn(foodDetail)}>
          Gửi cảnh báo
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
