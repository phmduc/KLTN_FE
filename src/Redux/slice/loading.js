import { createSlice } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
  name: "status",
  initialState: {
    value: 1,
  },
  reducers: {
    loading: (state, action) => {
      state.value = 0;
    },
    unLoadding: (state, action) => {
      state.value = 1;
    },
  },
});
export const { loading, unLoadding } = loadingSlice.actions;

export default loadingSlice.reducer;
