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

      const idSectionExist = state.selectedProduct.sections?.some(
        (secId) => secId.ID === ID
      );

      if (idSectionExist) {
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
