import { getItemVariation } from "@/query/itemRequest";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to query itemVariation by ID
export const fetchItemVariationById = createAsyncThunk(
  "item/fetchItemVariationById",

  async (ID, thunkAPI) => {
    try {
      const data = await getItemVariation(ID);
      if (!data || Object.keys(data).length === 0) {
        // Return a value to indicate that data is empty
        return null;
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

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
      const { ITEMUNITID, UNIT } = action.payload;

      const isIdExist = state.itemVariation.some(
        (item) => item.ITEMUNITID === ITEMUNITID
      );

      if (isIdExist) {
        alert(
          `Unit ${UNIT} Id #${ITEMUNITID} already exist in the item variation list`
        );
      } else {
        state.itemVariation.push(action.payload);
      }
    },
    removeSelectedVariations(state) {
      state.itemVariation = state.itemVariation.filter(
        (variation) => !variation.isSelected
      );
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchItemVariationById.fulfilled, (state, action) => {
        // If the fetched data is an array
        const items = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];

        // Ensure each item includes isSelected: false
        const newItems = items.map((item) => ({
          ...item,
          isSelected: false,
        }));

        // Add the new items if they don't already exist in the array
        newItems.forEach((newItem) => {
          const isIdExist = state.itemVariation.some(
            (variation) => variation.ID === newItem.ID
          );
          if (!isIdExist) {
            state.itemVariation.push(newItem);
          } else {
            console.log("Item already exists:", newItem);
          }
        });
      })
      .addCase(fetchItemVariationById.rejected, (state, action) => {
        console.log("Failed to fetch item variation:", action.payload.error);
      });
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
  removeSelectedVariations,
} = itemSlice.actions;
export default itemSlice.reducer;
