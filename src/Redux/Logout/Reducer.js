// reducers/userReducer.js

import { LOGOUT } from './Logout';

const initialState = {
  user: null, // Hoặc giá trị mặc định khác
  // Các trạng thái khác
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT:
      return {
        ...state,
        user: null, // Xóa thông tin người dùng
      };
    // Các trường hợp khác
    default:
      return state;
  }
};

export default userReducer;
