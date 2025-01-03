import { createSlice } from "@reduxjs/toolkit";
import { format } from "date-fns";

const initialState = {
  lastUsedId: 0,
  isEditMode: false,
  selectedProduct: {
    sections: [],
  },
  dailyConsumption: [],
  monthlyProductEntry: [],
  productionData: {},
};

const scSlice = createSlice({
  name: "sc",
  initialState,
  reducers: {
    addMonthlyProductEntry: (state, action) => {
      const productExists = state.monthlyProductEntry.some(
        (entry) => entry.ID === action.payload.ID
      );

      if (productExists) {
        alert("Product already exists");
        return; // Exit the function without adding the product
      }

      state.monthlyProductEntry = [
        ...state.monthlyProductEntry,
        action.payload,
      ];
    },
    updateQtyForMonthlyProductEntry: (state, action) => {
      const { ID, QTY } = action.payload;

      const product = state.monthlyProductEntry.find(
        (entry) => entry.ID === ID
      );

      if (product) {
        product.QTY = QTY; // Update the QTY field
      } else {
        alert("Product not found");
      }
    },

    clearMonthlyProductEntryData: (state) => {
      state.monthlyProductEntry = [];
    },
    updateSelectedProduct: (state, action) => {
      state.selectedProduct = { ...state.selectedProduct, ...action.payload };
    },
    updateIsEditMode: (state, action) => {
      state.isEditMode = action.payload;
    },
    loadDailyConsumptionData: (state, action) => {
      state.dailyConsumption = [];

      if (Array.isArray(action.payload) && action.payload.length > 0) {
        state.dailyConsumption = [...action.payload];
      }
    },

    updateDialyConsumptionItemQty: (state, action) => {
      const { currentSection, items } = action.payload;

      const newItem = state.dailyConsumption.map((item) =>
        item.ID === items.itemId && item.SECTIONID === currentSection
          ? { ...item, QTY: items.value }
          : item
      );

      state.dailyConsumption = newItem;
    },

    resetDailyConsumptionBasket: (state, action) => {
      state.dailyConsumption = [];
    },

    setSelectedProduct: (state, action) => {
      state.selectedProduct = {
        ...state.selectedProduct,
        ...action.payload,
      };
    },

    setSelectedSection: (state, action) => {
      const { SECTIONID, DESCRIPTION } = action.payload;

      const isSectionExist = state.selectedProduct.sections?.some(
        (secId) => secId.SECTIONID === SECTIONID
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
    addItemToSection: (state, action) => {
      const { sectionActive, item } = action.payload;

      const isItemExist = state.selectedProduct.sections[
        sectionActive
      ].ITEMS.some((rItem) => rItem.ID === item.ID);

      if (isItemExist) {
        alert(`Item ${item.NAMEENG} already exist!`);
      } else {
        state.selectedProduct.sections[sectionActive].ITEMS.push(item);
      }
    },
    removeItemSection: (state, action) => {
      const { currentSection, selectedId } = action.payload;

      state.selectedProduct.sections[currentSection].ITEMS =
        state.selectedProduct.sections[currentSection].ITEMS.filter(
          (item) => item.ID !== selectedId
        );
    },
    updateItemQty: (state, action) => {
      const { currentSection, items } = action.payload;

      const newItem = state.selectedProduct.sections[currentSection].ITEMS.map(
        (item) =>
          item.ID === items.itemId ? { ...item, QTY: items.value } : item
      );

      state.selectedProduct.sections[currentSection].ITEMS = newItem;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = {
        sections: [],
      };
    },
    setProductionData: (state, action) => {
      const formattedPayload = {
        ...action.payload,
        DATEPRODUCTION: format(
          new Date(action.payload.DATEPRODUCTION),
          "yyyy-MM-dd"
        ),
      };
      state.productionData = formattedPayload;
    },
    clearProductionData: (state) => {
      state.productionData = {};
    },
  },
});

export const {
  updateSelectedProduct,
  updateIsEditMode,
  loadDailyConsumptionData,
  setSelectedProduct,
  setProductionData,
  resetDailyConsumptionBasket,
  clearSelectedProduct,
  clearProductionData,
  setSelectedSection,
  addItemToSection,
  updateDialyConsumptionItemQty,
  updateItemQty,
  removeItemSection,
  addMonthlyProductEntry,
  updateQtyForMonthlyProductEntry,
  clearMonthlyProductEntryData,
} = scSlice.actions;

export default scSlice.reducer;
