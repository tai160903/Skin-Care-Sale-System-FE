import axiosClient from "./api.config";

const addressService = {
  getProvince: () => axiosClient.get("/api/address/province"),
  getDistrict: (provinceId) =>
    axiosClient.get(`/api/address/districts/${provinceId}`),
  getWard: (districtId) => axiosClient.get(`/api/address/wards/${districtId}`),
  getStreet: (wardId) => axiosClient.get(`/api/address/streets/${wardId}`),
  getProvinceById: (provinceId) =>
    axiosClient.get(`/api/address/provinces/${provinceId}`),
};

export default addressService;
