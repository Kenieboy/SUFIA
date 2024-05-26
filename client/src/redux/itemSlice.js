// src/redux/itemSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  NameEng: "",
  NameJp: "",
  itemClass: "",
  itemCategory: "",
  itemVariation: [],
  defaultCustomer: "",
  defaultSupplier: "",
  forSO: "",
  forPO: "",
  forPL: "",
  forInvoice: "",
  notes: "",
};

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    setItem(state, action) {
      return { ...state, ...action.payload };
    },
    updateItemField(state, action) {
      const { name, value } = action.payload;
      const keys = name.split("."); // Handle nested fields
      let current = state;

      while (keys.length > 1) {
        const key = keys.shift();
        current = current[key];
      }

      current[keys[0]] = value;
    },
    addItemVariation(state, action) {
      state.itemVariation.push(action.payload);
    },
    updateItemVariation(state, action) {
      const { index, name, value } = action.payload;
      state.itemVariation[index][name] = value;
    },
    removeItemVariation(state, action) {
      state.itemVariation.splice(action.payload, 1);
    },
  },
});

export const {
  setItem,
  updateItemField,
  addItemVariation,
  updateItemVariation,
  removeItemVariation,
} = itemSlice.actions;
export default itemSlice.reducer;
