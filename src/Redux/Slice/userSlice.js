import { createSlice } from "@reduxjs/toolkit";

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

