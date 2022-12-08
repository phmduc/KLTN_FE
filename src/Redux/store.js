import { configureStore, combineReducers } from "@reduxjs/toolkit";
import productReducer from "./slice/productSlice";
import cartReducer from "./slice/cartSlice";
import categoryReducer from "./slice/categorySlice";
import userReducer from "./slice/userSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";
import loadingReducer from "./slice/loading";

const persistConfig = {
  key: "state",
  storage,
};

const rootReducer = combineReducers({
  product: productReducer,
  cart: cartReducer,
  userInfo: userReducer,
  category: categoryReducer,
  loading: loadingReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export default store;
export const persistor = persistStore(store);
