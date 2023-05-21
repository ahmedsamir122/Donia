import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { wishlist: [], change: false },
  reducers: {
    toggle(state, action) {
      const item = state.wishlist.find(
        (item) => action.payload.user === item.user
      );
      state.change = true;
      if (!item) {
        state.wishlist.push(action.payload);
      }
      if (item) {
        const index = state.wishlist.findIndex(
          (item) => item.user === action.payload.user
        );
        state.wishlist.splice(index, 1);
      }
    },
    replaceWishList(state, action) {
      state.wishlist = action.payload;
    },
  },
});

export default wishlistSlice.reducer;
export const wishlistActions = wishlistSlice.actions;
