import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  itemClass: [],
  itemCategory: [],
  defaultCustomer: [],
  defaultSupplier: [],
  itemVariation: [],
};

const itemSlice = createSlice({
  name: "itemData",
  initialState,
  reducers: {
    addItem(state, action) {
      const { item, arrayType } = action.payload;

      if (state[arrayType].length === 0) {
        state[arrayType].push(...item);
      }
    },
    addItemVariation(state, action) {
      const { ID } = action.payload;

      const isIdExist = state.itemVariation.some((item) => item.ID === ID);

      if (isIdExist) {
        alert(`Id #${ID} already exist in the list`);
      } else {
        state.itemVariation.push(action.payload);
      }
    },
    toggleItemVariationSelection(state, action) {
      const { ID } = action.payload;
      const itemVariation = state.itemVariation.find(
        (variation) => variation.ID === ID
      );
      if (itemVariation) {
        itemVariation.isSelected = !itemVariation.isSelected;
      }
    },
    resetAllArray(state) {
      state.itemCategory = [];
      state.itemClass = [];
      state.defaultCustomer = [];
      state.defaultSupplier = [];
    },
    resetItemVariation(state) {
      state.itemVariation = [];
    },
  },
});

export const addItemAction = (item, arrayType) => ({
  type: "itemData/addItem",
  payload: { item, arrayType },
});

export const {
  resetAllArray,
  resetItemVariation,
  addItemVariation,
  toggleItemVariationSelection,
} = itemSlice.actions;
export default itemSlice.reducer;
