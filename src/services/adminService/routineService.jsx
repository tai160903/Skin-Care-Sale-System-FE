// routineService.js
import axiosClient from "../api.config";

const API_URL = "/api/routines";

const getAllRoutines = async () => {
  try {
    const response = await axiosClient.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching routines:", error);
    throw error;
  }
};

export default { getAllRoutines };
