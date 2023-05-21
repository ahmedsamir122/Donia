import { createSlice } from "@reduxjs/toolkit";

const blocklistSlice = createSlice({
  name: "blocklist",
  initialState: { blocklist: [], change: false },
  reducers: {
    toggle(state, action) {
      const item = state.blocklist.find(
        (item) => action.payload.user === item.user
      );
      state.change = true;
      if (!item) {
        state.blocklist.push(action.payload);
      }
      if (item) {
        const index = state.blocklist.findIndex(
          (item) => item.user === action.payload.user
        );
        state.blocklist.splice(index, 1);
      }
    },
    replaceBlockList(state, action) {
      state.blocklist = action.payload;
    },
  },
});

export default blocklistSlice.reducer;
export const blocklistActions = blocklistSlice.actions;
