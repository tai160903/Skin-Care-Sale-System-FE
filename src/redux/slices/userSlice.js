import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  customer: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, customer, token } = action.payload;
      state.user = user;
      state.token = token;
      state.customer = customer;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.customer = null;
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export const selectUser = (store) => store.user;

export default userSlice.reducer;
