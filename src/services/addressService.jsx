import axiosClient from "./api.config";

const addressService = {
  getProvince: () =>
    axiosClient.get(
      `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province`,
      {
        headers: {
          "Content-Type": "application/json",
          Token: import.meta.env.VITE_API_GHN,
        },
      },
    ),

  getDistrict: (provinceId) =>
    axiosClient.post(
      `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district`,
      {
        province_id: provinceId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Token: import.meta.env.VITE_API_GHN,
        },
      },
    ),

  getWard: (districtId) =>
    axiosClient.post(
      `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id`,
      {
        district_id: districtId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Token: import.meta.env.VITE_API_GHN,
        },
      },
    ),
  getStreet: (wardId) => axiosClient.get(`/api/address/streets/${wardId}`),
  getProvinceById: (provinceId) =>
    axiosClient.get(`/api/address/provinces/${provinceId}`),
};

export default addressService;
