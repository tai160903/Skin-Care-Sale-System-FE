/* eslint-disable no-undef */
import axios from "axios";

const authService = {
  signin: async (data) => {
    return await axios.post(`http://localhost:8080/api/auth/login`, data);
  },
  logout: async () => {
    return await axios.post(
      `${process.env.REACT_APP_BACKEND_API_URL}/api/auth/logout`,
    );
  },
  verifyEmail: async (data) => {
    return await axios.post(
      `${process.env.REACT_APP_BACKEND_API_URL}/api/auth/verify`,
      data,
    );
  },
  verifyEmailResetPassword: async (data) => {
    return await axios.post(
      `${process.env.REACT_APP_BACKEND_API_URL}/api/auth/verify-reset-password`,
      data,
    );
  },
};

export default authService;
