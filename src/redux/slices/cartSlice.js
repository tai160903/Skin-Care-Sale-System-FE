import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Lưu vào localStorage

const initialState = []; // Không cần lấy từ localStorage vì đã có Redux Persist

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.find((item) => item.productId === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.push({ productId, quantity });
      }
    },

    removeFromCart: (state, action) => {
      return state.filter((item) => item.productId !== action.payload);
    },

    clearCart: () => {
      return [];
    },
  },
});

// Cấu hình Redux-Persist
const persistConfig = {
  key: "cart",
  storage,
};

const persistedCartReducer = persistReducer(persistConfig, cartSlice.reducer);

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default persistedCartReducer;
