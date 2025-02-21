import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import draftOrderService from "../../services/draftOrderService";

// Thunk để tạo đơn hàng
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async ({ customerId, orderData }, { rejectWithValue }) => {
    try {
      const response = await draftOrderService.createDraftOrder(
        customerId,
        orderData,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
