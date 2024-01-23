import { createSlice } from "@reduxjs/toolkit";

const reportsSlice = createSlice({
  name: "reports",
  initialState: { activeReports: 0, totalReports: 0, completeReports: 0 },
  reducers: {
    updateActiveReports(state, action) {
      state.activeReports = action.payload.activeReports;
      state.totalReports = action.payload.totalReports;
      state.completeReports = action.payload.totalReports - state.activeReports;
    },
  },
});

export default reportsSlice.reducer;
export const reportsActions = reportsSlice.actions;
