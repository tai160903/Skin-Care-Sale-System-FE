import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage by default
import userReducer from "./slices/userSlice"; // Your user slice

const persistConfig = {
  key: "root",
  storage, // You can change this to sessionStorage if you want session persistence
};

const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistedReducer, // Persist user reducer
  },
});

export const persistor = persistStore(store);
