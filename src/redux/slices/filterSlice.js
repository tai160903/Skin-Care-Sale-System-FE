import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  category: "",
  priceRange: [0, 100],
  brand: "",
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    updateFilters: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

// Xuất đúng action
export const { updateFilters } = filterSlice.actions;

export default filterSlice.reducer;
