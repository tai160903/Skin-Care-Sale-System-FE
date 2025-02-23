import axiosClient from "./api.config";

const draftOrderService = {
  getDraftOrder: (customerId) =>
    axiosClient.get(`/api/draftOrders/${customerId}`),

  createDraftOrder: (customerId, data) =>
    axiosClient.post(`/api/draftOrders/${customerId}`, data),
};
export default draftOrderService;
