import axiosClient from "./api.config";

const API_URL = import.meta.env.VITE_API_URL;

const authService = {
  signin: (data) => axiosClient.post("/api/auth/login", data),

  signup: (data) => axiosClient.post("/api/auth/register", data),

  logout: () => axiosClient.post("/api/auth/logout"),

  verifyEmail: (id, token) =>
    axiosClient.get(`/api/auth/verify-email/${token}/${id}`),

  forgotPassword: (email) =>
    axiosClient.post("/api/auth/reset-password", { email }),

  verifyEmailResetPassword: (id, token, data) =>
    axiosClient.post(`/api/auth/change-password/${id}/${token}`, data),

  loginWithGoogle: () => {
    window.location.href = `${API_URL}/api/auth/google`;
  },
};

export default authService;
