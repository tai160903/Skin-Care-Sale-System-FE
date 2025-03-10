import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Lưu vào localStorage
import userReducer from "./slices/userSlice";
import cartReducer from "./slices/cartSlice";
import compareReducer from "./slices/compareSlice";
// import filterReducer from "./slices/filterSlice"; // Không cần persist

const userPersistConfig = {
  key: "user",
  storage,
};

const cartPersistConfig = {
  key: "cart",
  storage,
};

const compareConfig = {
  key: "compare",
  storage,
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedCompareReducer = persistReducer(compareConfig, compareReducer); // Không cần persist vì dữ liệu có thể thay đ��i thư��ng xuyên.

export const store = configureStore({
  reducer: {
    user: persistedUserReducer, // Lưu trữ user vào localStorage
    cart: persistedCartReducer, // Lưu trữ giỏ hàng vào localStorage
    compare: persistedCompareReducer, // Lưu trữ danh sách sản phẩm đã so sánh vào localStorage
    // filter: filterReducer, // Không cần persist vì dữ liệu có thể thay đổi thường xuyên.
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Fix lỗi Redux Persist cảnh báo về serializable
    }),
});

export const persistor = persistStore(store);
