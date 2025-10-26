// store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // dùng localStorage

// Import các slice
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/products-slice";
import adminOrderSlice from "./admin/order-slice";
import adminUserSlice from "./admin/user-slice";
import shopProductsSlice from "./shop/products-slice";
import shopCartSlice from "./shop/cart-slice";
import shopAddressSlice from "./shop/address-slice";
import shopOrderSlice from "./shop/order-slice";
import shopSearchSlice from "./shop/search-slice";
import shopReviewSlice from "./shop/review-slice";
import commonFeatureSlice from "./common-slice";

// ✅ Cấu hình redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "shopCart", "shopProducts"], // chỉ lưu 2 reducer này
};

// ✅ Gộp tất cả reducer lại
const rootReducer = combineReducers({
  auth: authReducer,

  adminProducts: adminProductsSlice,
  adminOrder: adminOrderSlice,
  adminUser: adminUserSlice,

  shopProducts: shopProductsSlice,
  shopCart: shopCartSlice,
  shopAddress: shopAddressSlice,
  shopOrder: shopOrderSlice,
  shopSearch: shopSearchSlice,
  shopReview: shopReviewSlice,

  commonFeature: commonFeatureSlice,
});

// ✅ Bọc rootReducer bằng persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Tạo store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // cần tắt khi dùng redux-persist
    }),
});

// ✅ Tạo persistor
export const persistor = persistStore(store);
