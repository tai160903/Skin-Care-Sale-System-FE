import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  total: 0,
  discount: 0, // Giảm giá (nếu có)
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload.items;
      state.total = action.payload.total;
      state.discount = action.payload.discount;
    },

    addToCart: (state, action) => {
      const { product_id, product, quantity = 1 } = action.payload;
      const item = state.items.find((i) => i.product_id._id === product_id);
      if (item) {
        item.quantity += quantity; // Cộng thêm số lượng được chọn
      } else {
        state.items.push({ ...product, quantity });
      }

      state.total = state.items.reduce(
        (sum, item) => sum + item.product_id.price * item.quantity,
        0,
      );
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find((i) => i.product_id._id === action.payload);
      if (item) {
        item.quantity += 1;
      }

      state.total = state.items.reduce(
        (sum, item) => sum + item.product_id.price * item.quantity,
        0,
      );
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find((i) => i.product_id._id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }

      state.total = state.items.reduce(
        (sum, item) => sum + item.product_id.price * item.quantity,
        0,
      );
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (i) => i.product_id._id !== action.payload,
      );
      state.total = state.items.reduce(
        (sum, item) => sum + item.product_id.price * item.quantity,
        0,
      );
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.discount = 0;
    },

    applyDiscount: (state, action) => {
      state.discount = action.payload;
    },
  },
});

export const {
  setCart,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  applyDiscount,
} = cartSlice.actions;

export default cartSlice.reducer;
