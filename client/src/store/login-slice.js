import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: "" },
  reducers: {
    login(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
    },
    getToken(state, action) {
      state.token = action.payload;
    },
  },
});

export default authSlice.reducer;
export const authActions = authSlice.actions;
