// src/redux/itemSlice.js
import { getItemVariation } from "@/query/itemRequest";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to query itemVariation by ID
export const fetchItemVariationById = createAsyncThunk(
  "item/fetchItemVariationById",

  async (ID, thunkAPI) => {
    try {
      const data = await getItemVariation(ID);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

const initialState = {
  itemVariation: [],
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
      const keys = name.split(".");
      let current = state;

      while (keys.length > 1) {
        const key = keys.shift();
        current = current[key];
      }

      current[keys[0]] = value;
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

    getItemVariationBackToArray(state, action) {
      const { ID } = action.payload;

      const data = getItemVariation(ID);

      console.log(data);
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
        (variation) => variation.ID === id
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
      const itemVariation = state.itemVariation.find(
        (variation) => variation.ID === ID
      );
      if (itemVariation) {
        Object.assign(itemVariation, action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItemVariationById.fulfilled, (state, action) => {
        console.log("Fetched item:", action.payload);

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
        console.error("Failed to fetch item variation:", action.payload.error);
      });
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
  getItemVariationBackToArray,
} = itemSlice.actions;
export default itemSlice.reducer;
