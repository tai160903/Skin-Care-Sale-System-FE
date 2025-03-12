import axiosClient from "../api.config";

const API_URL = "/api/dashboard";

export const getDashboardData = async (timeFilter) => {
  try {
    const response = await axiosClient.get(
      `${API_URL}?timeFilter=${timeFilter}`,
      {
        headers: { Accept: "application/json" },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
};
