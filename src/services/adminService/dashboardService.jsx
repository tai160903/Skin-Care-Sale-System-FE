import axiosClient from "../api.config";

const API_URL = "/api/dashboard";

export const getDashboardData = async (timeFilter) => {
  try {
    let startDate = timeFilter.startDate;
    let endDate = timeFilter.endDate;
    const response = await axiosClient.get(
      `${API_URL}?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: { Accept: "application/json" },
      },
    );
    console.log("timeFilter", timeFilter);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
};
