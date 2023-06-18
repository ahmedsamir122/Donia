import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: { socket: null },
  reducers: {
    getSocket(state, action) {
      state.socket = action.payload;
    },
  },
});

export default socketSlice.reducer;
export const socketActions = socketSlice.actions;
