// services/adminService/shipFeeService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/shipfees";

const shipFeeService = {
  getAllShipFees: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },
  createShipFee: async (shipFee) => {
    const response = await axios.post(API_URL, shipFee);
    return response.data;
  },
  getShipFeeByLocation: async (location) => {
    const response = await axios.get(`${API_URL}/location`, {
      params: { location },
    });
    return response.data;
  },
  updateShipFee: async (id, shipFee) => {
    const response = await axios.put(`${API_URL}/${id}`, shipFee);
    return response.data;
  },
  deleteShipFee: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },
};

export default shipFeeService;
