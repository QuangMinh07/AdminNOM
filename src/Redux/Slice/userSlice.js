import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode"; // Sửa import để sử dụng đúng hàm jwtDecode

const initialState = {
  accessToken: localStorage.getItem("accessToken") || null,
  userInfo: JSON.parse(localStorage.getItem("userInfo")) || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, userInfo } = action.payload;

      state.accessToken = accessToken;
      state.userInfo = userInfo;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      try {
        // Giải mã JWT để lấy thông tin người dùng
        const decodedToken = jwtDecode(accessToken);
        state.userInfo = decodedToken;

        // Log thời hạn token
        const currentTime = Math.floor(Date.now() / 1000); // Lấy thời gian hiện tại tính theo giây
        console.log("Token expires at:", decodedToken.exp); // Thời hạn hết hạn của token
        console.log("Current time:", currentTime); // Thời gian hiện tại
        console.log(
          "Token will expire in:",
          decodedToken.exp - currentTime,
          "seconds"
        );

        // Kiểm tra xem token đã hết hạn hay chưa
        if (decodedToken.exp < currentTime) {
          console.warn("Token has expired!");
          state.accessToken = null;
          state.userInfo = null;
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userInfo");
          alert("Phiên làm việc của bạn đã hết hạn, vui lòng đăng nhập lại.");
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        state.userInfo = null;
      }
    },
    logout: (state) => {
      state.accessToken = null;
      state.userInfo = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userInfo");
    },
  },
});

export const { setCredentials, logout } = userSlice.actions;

export default userSlice.reducer;
