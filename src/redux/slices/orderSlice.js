import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import draftOrderService from "../../services/draftOrderService";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (data, { rejectWithValue }) => {
    try {
      const response = await draftOrderService.createOrder({
        customerId: data.customer,
        payment_method: data.paymentMethod,
        address:
          (data.address = `${data.address.street}, ${data.address.ward}, ${data.address.district}, ${data.address.province}`),
        phone: data.phone,
        cart: data.cart,
        totalAmount: data.totalAmount,
        status: data.status,
      });
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
    lastOrder: null, // Lưu đơn hàng mới nhất
    loading: false,
    error: null,
  },
  reducers: {
    clearLastOrder: (state) => {
      state.lastOrder = null; // Xóa đơn hàng mới nhất sau khi hiển thị
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.lastOrder = action.payload;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearLastOrder } = orderSlice.actions;
export default orderSlice.reducer;
