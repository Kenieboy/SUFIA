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
      state.itemVariation.push({ ...state.itemVariation, ...action.payload });
    },
    resetAllArray(state) {
      state.itemCategory = [];
      state.itemClass = [];
      state.defaultCustomer = [];
      state.defaultSupplier = [];
    },
  },
});

export const addItemAction = (item, arrayType) => ({
  type: "itemData/addItem",
  payload: { item, arrayType },
});

export const { resetAllArray, addItemVariation } = itemSlice.actions;
export default itemSlice.reducer;
