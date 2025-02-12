import axiosClient from "./api.config";

const API_URL = import.meta.env.VITE_API_URL;

const authService = {
  signin: (data) => axiosClient.post("/api/auth/login", data),

  logout: () => axiosClient.post("/api/auth/logout"),

  verifyEmail: (data) => axiosClient.post("/api/auth/verify", data),

  verifyEmailResetPassword: (data) =>
    axiosClient.post("/api/auth/verify-reset-password", data),

  loginWithGoogle: () => {
    window.location.href = `${API_URL}/api/auth/google`; // Chuyển hướng tới OAuth Google
  },
};

export default authService;
