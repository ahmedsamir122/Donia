import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
// import cartReducer from "./cart";
// import wishlistReducer from "./wishlist";
import authReducer from "./login-slice";
import wishlistReducer from "./wishlist";
import blocklistReducer from "./blocklist";
import lastMessageReducer from "./lastMessage";
import socketReducer from "./socket";
import queryReducer from "./query";

const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
    blocklist: blocklistReducer,
    auth: authReducer,
    query: queryReducer,
    lastMessage: lastMessageReducer,
    socket: socketReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false, // Disable the serializable check
  }),
});

export default store;
