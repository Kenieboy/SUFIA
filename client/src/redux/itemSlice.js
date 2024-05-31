import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  itemClass: [],
  itemUnit: [],
  itemCategory: [],
  defaultCustomer: [],
  defaultSupplier: [],
  item: {
    itemVariation: [],
  },
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
    resetAllArray(state) {
      state.itemUnit = [];
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

export const { resetAllArray } = itemSlice.actions;
export default itemSlice.reducer;
