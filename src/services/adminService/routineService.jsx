// src/services/adminService/routineService.js
import axiosClient from "../api.config";

const API_URL = "/api/routines";

const routineService = {
  // Lấy tất cả routines (GET)
  getAllRoutines: async () => {
    try {
      const response = await axiosClient.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching routines:", error);
      throw error;
    }
  },

  // Tạo một routine mới (POST)
  createRoutine: async (routineData) => {
    try {
      const response = await axiosClient.post(API_URL, routineData);
      return response.data;
    } catch (error) {
      console.error("Error creating routine:", error);
      throw error;
    }
  },

  // Cập nhật routine theo ID (PUT)
  updateRoutine: async (routineId, routineData) => {
    try {
      console.log("id", routineId);
      const response = await axiosClient.put(
        `${API_URL}/${routineId}`,
        routineData,
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating routine ${routineId}:`, error);
      throw error;
    }
  },

  // Xóa routine theo ID (DELETE)
  deleteRoutine: async (routineId) => {
    try {
      const response = await axiosClient.delete(`${API_URL}/${routineId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting routine ${routineId}:`, error);
      throw error;
    }
  },
};

export default routineService;
