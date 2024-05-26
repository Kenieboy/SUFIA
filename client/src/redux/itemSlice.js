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
      const id = action.payload;
      const index = state.itemVariation.findIndex(
        (variation) => variation.UNITID === id
      );
      if (index !== -1) {
        state.itemVariation.splice(index, 1);
      }
    },
    toggleItemVariationSelection(state, action) {
      const id = action.payload;
      const itemVariation = state.itemVariation.find(
        (variation) => variation.UNITID === id
      );
      if (itemVariation) {
        itemVariation.isSelected = !itemVariation.isSelected;
      }
    },
    removeSelectedVariations(state) {
      state.itemVariation = state.itemVariation.filter(
        (variation) => !variation.isSelected
      );
    },
    resetItemVariations(state) {
      state.itemVariation = [];
    },
    updateItemVariationById(state, action) {
      const { ID } = action.payload;
      console.log("slice", ID);
      const itemVariation = state.itemVariation.find(
        (variation) => variation.ID === ID
      );
      if (itemVariation) {
        Object.assign(itemVariation, action.payload);
      }
    },
  },
});

export const {
  setItem,
  updateItemField,
  addItemVariation,
  updateItemVariation,
  removeItemVariation,
  toggleItemVariationSelection,
  removeSelectedVariations,
  resetItemVariations,
  updateItemVariationById,
} = itemSlice.actions;
export default itemSlice.reducer;
