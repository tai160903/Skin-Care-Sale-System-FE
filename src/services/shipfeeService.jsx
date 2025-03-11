import axiosClient from "./api.config";

const shipfeeService = {
  getShipfee: (province, district) => {
    return axiosClient.post("/api/shipfees/location", {
      province: province,
      district: district,
    });
  },
};
export default shipfeeService;
