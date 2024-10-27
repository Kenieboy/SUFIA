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

    setSelectedSection: (state, action) => {
      const { ID, DESCRIPTION } = action.payload;

      const isSectionExist = state.selectedProduct.sections?.some(
        (secId) => secId.ID === ID
      );

      if (isSectionExist) {
        alert(`${DESCRIPTION} already exist!`);
      } else {
        state.selectedProduct.sections = [
          ...state.selectedProduct.sections,
          action.payload,
        ];
      }
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = {
        sections: [],
      };
    },
  },
});

export const { setSelectedProduct, clearSelectedProduct, setSelectedSection } =
  scSlice.actions;

export default scSlice.reducer;
