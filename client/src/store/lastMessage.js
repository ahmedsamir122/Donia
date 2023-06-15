import { createSlice } from "@reduxjs/toolkit";

const lastMessageSlice = createSlice({
  name: "lastMessage",
  initialState: { lastMessage: {} },
  reducers: {
    getLastMessage(state, action) {
      state.lastMessage = { ...action.payload };
    },
  },
});

export default lastMessageSlice.reducer;
export const lastMessageActions = lastMessageSlice.actions;
