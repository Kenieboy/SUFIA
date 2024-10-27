import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lastUsedId: 0,

  standardConsumptionDetail: [],
  selectedProduct: {},
};

const scSlice = createSlice({
  name: "sc",
  initialState,
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = {};
    },

    setSelectedProductSections: (state, action) => {
      state.selectedProduct = {
        ...state.selectedProduct,
        sections: [...(state.selectedProduct.sections || []), action.payload],
      };
    },
  },
});

export const {
  setSelectedProduct,
  clearSelectedProduct,
  setSelectedProductSections,
} = scSlice.actions;
export default scSlice.reducer;
