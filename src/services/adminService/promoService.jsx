import axiosClient from "../api.config";
import axios from "axios";

const API_URL = "http://localhost:8080/api/promotions";
const getPromotion = async () => {
  try {
    const response = await axiosClient.get("/api/promotions");
    return response.data;
  } catch (error) {
    console.error("Error fetching promotions:", error);
    return [];
  }
};
const getPointCondition = async () => {
  try {
    const response = await axiosClient.get("/api/conditionPoints");
    return response.data;
  } catch (error) {
    console.error("Error fetching points:", error);
    return [];
  }
};

const getPromotionById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: { Accept: "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy khuyến mãi theo ID:",
      error.response ? error.response.data : error,
    );
    return null;
  }
};

const createPromotion = async (promoData) => {
  try {
    const response = await axios.post(API_URL, promoData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi tạo khuyến mãi:",
      error.response ? error.response.data : error,
    );
    throw error;
  }
};

const updatePromotion = async (id, promoData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, promoData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi cập nhật khuyến mãi:",
      error.response ? error.response.data : error,
    );
    throw error;
  }
};
const updatePointCondition = async (id, promoData) => {
  try {
    const response = await axiosClient.put(`/api/conditionPoints/${id}`, promoData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi cập nhật khuyến.maxcdn:",
      error.response ? error.response.data : error,
    );
    throw error;
  }
};

const deletePromotion = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Accept: "application/json" },
    });
    return { success: true, message: "Khuyến mãi đã được xóa thành công" };
  } catch (error) {
    console.error(
      "Lỗi khi xóa khuyến mãi:",
      error.response ? error.response.data : error,
    );
    return { success: false, message: "Xóa khuyến mãi thất bại" };
  }
};

export {
  getPromotion,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
  getPointCondition,
  updatePointCondition
};
