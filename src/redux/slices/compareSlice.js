import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: JSON.parse(localStorage.getItem("comparedProducts")) || [],
};

const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    addToCompare: (state, action) => {
      if (state.products.find((p) => p.id === action.payload.id)) {
        alert("📌 Sản phẩm này đã có trong danh sách so sánh!");
        return;
      }
      if (state.products.length >= 4) {
        alert("🚀 Bạn chỉ có thể so sánh tối đa 4 sản phẩm cùng lúc!");
        return;
      }
      state.products.push(action.payload);
      alert("✅ Đã thêm sản phẩm vào danh sách so sánh!");
    },
    removeFromCompare: (state, action) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
      alert("❌ Đã xóa sản phẩm khỏi danh sách so sánh!");
    },
    clearCompare: (state) => {
      state.products = [];
      alert("🔄 Đã xóa toàn bộ danh sách so sánh!");
    },
  },
});

export const { addToCompare, removeFromCompare, clearCompare } =
  compareSlice.actions;
export default compareSlice.reducer;
