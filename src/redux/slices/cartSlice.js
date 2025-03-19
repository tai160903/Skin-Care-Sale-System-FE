import { createSlice } from "@reduxjs/toolkit";
import cartService from "../../services/cartService";

const initialState = {
  items: [],
  total: 0,
  discount: 0,
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
      const item = action.payload;
      const existingItem = state.items.find(
        (i) => i.product_id._id === item.product._id,
      );

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.items.push({
          product_id: item.product,
          quantity: item.quantity,
        });
      }

      state.total = state.items.reduce(
        (sum, item) =>
          sum +
          item.product_id.price * item.quantity * (1 - state.discount / 100),
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
      const productId = action.payload;
      state.items = state.items.filter(
        (item) => item.product_id._id !== productId,
      );

      state.total = state.items.reduce(
        (total, item) => total + item.product_id.price * item.quantity,
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

export const updateCartQuantity =
  (customerId, productId, quantity) => async (dispatch) => {
    try {
      await cartService.updateItemQuantity({
        customerId,
        productId,
        quantity,
      });

      if (quantity > 0) {
        dispatch(increaseQuantity(productId));
      } else {
        dispatch(decreaseQuantity(productId));
      }
    } catch (error) {
      console.error("Lỗi cập nhật giỏ hàng:", error);
    }
  };

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
