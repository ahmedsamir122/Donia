import { configureStore } from "@reduxjs/toolkit";
// import cartReducer from "./cart";
// import wishlistReducer from "./wishlist";
import authReducer from "./login-slice";
import wishlistReducer from "./wishlist";
import blocklistReducer from "./blocklist";
import queryReducer from "./query";

const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
    blocklist: blocklistReducer,
    auth: authReducer,
    query: queryReducer,
  },
});

export default store;
