import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Lưu vào localStorage
import userReducer from "./slices/userSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
import filterReducer from "./slices/filterSlice"; // Không cần persist

// Cấu hình persist cho user
const userPersistConfig = {
  key: "user",
  storage,
};

// Cấu hình persist cho cart
const cartPersistConfig = {
  key: "cart",
  storage,
};

const draftOrderPersistConfig = {
  key: "draftOrder",
  storage,
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedDraftOrderReducer = persistReducer(
  draftOrderPersistConfig,
  orderReducer,
);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer, // Lưu trữ user vào localStorage
    cart: persistedCartReducer, // Lưu trữ giỏ hàng vào localStorage
    filter: filterReducer, // Không cần persist vì dữ liệu có thể thay đổi thường xuyên.
    order: persistedDraftOrderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Fix lỗi Redux Persist cảnh báo về serializable
    }),
});

export const persistor = persistStore(store);
