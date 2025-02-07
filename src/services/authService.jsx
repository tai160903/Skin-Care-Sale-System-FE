import axios from "axios";

const authService = {
  signin: async (data) => {
    return await axios.post(`http://localhost:8080/api/auth/login`, data);
  },

  signup: async (data) => {
    console.log(data);
    return await axios.post(`http://localhost:8080/api/auth/register`, data);
  },
  logout: async () => {
    return await axios.post(`http://localhost:8080/api/auth/logout`);
  },
  verifyEmail: async (data) => {
    return await axios.post(`http://localhost:8080/api/auth/verify`, data);
  },
  verifyEmailResetPassword: async (data) => {
    return await axios.post(
      `http://localhost:8080/api/auth/verify-reset-password`,
      data,
    );
  },
};

export default authService;
