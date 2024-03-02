import { createSlice } from "@reduxjs/toolkit";

const pusherSlice = createSlice({
  name: "pusher",
  initialState: { pusher: null },
  reducers: {
    getPusher(state, action) {
      state.pusher = action.payload;
    },
  },
});

export default pusherSlice.reducer;
export const pusherActions = pusherSlice.actions;
