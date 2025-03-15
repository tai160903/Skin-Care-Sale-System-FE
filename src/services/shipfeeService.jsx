import axiosClient from "./api.config";

const shipfeeService = {
  getService: () =>
    axiosClient.post(
      "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services",
      {
        shop_id: 885,
        from_district: 1447,
        to_district: 1442,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Token: import.meta.env.VITE_API_GHN,
        },
      },
    ),

  getShipfee: async (districtId, wardCode, cartLength) => {
    return axiosClient.post(
      "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
      {
        service_type_id: 2,
        to_district_id: districtId,
        to_ward_code: `${wardCode}`,
        weight: 200 * cartLength,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Token: import.meta.env.VITE_API_GHN,
          ShopId: import.meta.env.VITE_ID_SHOP_GHN,
        },
      },
    );
  },
};
export default shipfeeService;
