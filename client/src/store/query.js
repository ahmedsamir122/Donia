import { createSlice } from "@reduxjs/toolkit";

const querySlice = createSlice({
  name: "query",
  initialState: { query: "" },
  reducers: {
    addQuery(state, action) {
      state.query = action.payload;
    },
  },
});

export default querySlice.reducer;
export const queryActions = querySlice.actions;
