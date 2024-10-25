import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lastUsedId: 0,
  production: {},
  standardConsumptionDetail: [],
};

const scSlice = createSlice({
  name: "sc",
  initialState,
  reducers: {},
});

export const {} = scSlice.actions;
export default scSlice.reducer;
