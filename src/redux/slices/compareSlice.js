import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  products: JSON.parse(localStorage.getItem("comparedProducts")) || [],
};

const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    addToCompare: (state, action) => {
      if (state.products.find((p) => p.id === action.payload.id)) {
        toast.info("📌 Sản phẩm này đã có trong danh sách so sánh!");
        return;
      }
      if (state.products.length >= 4) {
        toast.info("🚀 Bạn chỉ có thể so sánh tối đa 4 sản phẩm cùng lúc!");
        return;
      }
      state.products.push(action.payload);
      toast.info("✅ Đã thêm sản phẩm vào danh sách so sánh!");
    },
    removeFromCompare: (state, action) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
      toast.info("❌ Đã xóa sản phẩm khỏi danh sách so sánh!");
    },
    clearCompare: (state) => {
      state.products = [];
      toast.info("🔄 Đã xóa toàn bộ danh sách so sánh!");
    },
  },
});

export const { addToCompare, removeFromCompare, clearCompare } =
  compareSlice.actions;
export default compareSlice.reducer;
