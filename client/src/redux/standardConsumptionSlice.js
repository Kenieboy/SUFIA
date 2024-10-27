import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lastUsedId: 0,
  selectedProduct: {
    sections: [],
  },
};

const scSlice = createSlice({
  name: "sc",
  initialState,
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = {
        ...state.selectedProduct,
        ...action.payload,
      };
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = {
        sections: [],
      };
    },
  },
});

export const { setSelectedProduct, clearSelectedProduct } = scSlice.actions;

export default scSlice.reducer;
