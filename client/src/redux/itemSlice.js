import {
  deleteFromItemVariationId,
  getItemVariation,
} from "@/query/itemRequest";
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

export const deleteFromItemVariation = createAsyncThunk(
  "item/deleteFromItemVariation",
  async (variation, { rejectWithValue }) => {
    const { ID } = variation;
    try {
      const res = await deleteFromItemVariationId(ID);
      return res.data.message;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  itemClass: [],
  itemCategory: [],
  defaultCustomer: [],
  defaultSupplier: [],
  itemVariation: [],
  data: [],
};

const itemSlice = createSlice({
  name: "itemData",
  initialState,
  reducers: {
    addData(state, action) {
      state.data.push(action.payload);
    },
    resetDataArr(state) {
      state.data = [];
    },
    addItem(state, action) {
      const { item, arrayType } = action.payload;

      if (state[arrayType].length === 0) {
        state[arrayType].push(...item);
      }
    },
    // addItemVariation(state, action) {
    //   let { ID } = action.payload;

    //   const isIdExist = state.itemVariation.some((item) => item.ID === ID);

    //   if (isIdExist) {
    //     // Increment the ID until it is unique
    //     while (state.itemVariation.some((item) => item.ID === ID)) {
    //       ID += 1;
    //     }
    //     // Set the incremented ID back to the payload
    //     action.payload.ID = ID;
    //   }

    //   state.itemVariation.push(action.payload);
    // },
    addItemVariationNegativeId(state, action) {
      let { ID } = action.payload;

      state.itemVariation.push({ ...action.payload, ID: -ID });
    },
    addItemVariation(state, action) {
      let { ID, FORSO, FORPO, FORPACKINGLIST, FORINVOICE } = action.payload;

      // Function to check if any property is already set to 1 in another object
      const isPropertyUnique = (property) => {
        return !state.itemVariation.some(
          (item) => item[property] === 1 && item.ID !== ID
        );
      };

      // Check if the properties are unique
      if (
        (FORSO === 1 && !isPropertyUnique("FORSO")) ||
        (FORPO === 1 && !isPropertyUnique("FORPO")) ||
        (FORPACKINGLIST === 1 && !isPropertyUnique("FORPACKINGLIST")) ||
        (FORINVOICE === 1 && !isPropertyUnique("FORINVOICE"))
      ) {
        // Do not add or update the item if any property constraint is violated
        console.warn("Cannot set the same property to 1 for multiple objects");
        return;
      }

      // Check if the ID already exists and increment if necessary
      while (state.itemVariation.some((item) => item.ID === ID)) {
        ID += 1;
      }
      action.payload.ID = ID;

      // Add or update the item
      const isIdExist = state.itemVariation.some((item) => item.ID === ID);

      if (isIdExist) {
        // If the ID exists, find the index of the item and update it
        const index = state.itemVariation.findIndex((item) => item.ID === ID);
        if (index !== -1) {
          state.itemVariation[index] = {
            ...state.itemVariation[index],
            ...action.payload,
          };
        }
      } else {
        // Otherwise, add the new item to the state
        state.itemVariation.push(action.payload);
      }
    },
    // toggleSelect(state, action) {
    //   const { itemId, propertyName } = action.payload;
    //   const item = state.itemVariation.find((item) => item.ID === itemId);

    //   if (item) {
    //     item[propertyName] = item[propertyName] === 0 ? 1 : 0;
    //   }
    // },
    toggleSelect(state, action) {
      const { itemId, propertyName } = action.payload;

      // Check if the property name is one of the restricted properties
      const restrictedProperties = [
        "FORSO",
        "FORPO",
        "FORPACKINGLIST",
        "FORINVOICE",
      ];
      if (!restrictedProperties.includes(propertyName)) {
        console.warn(`Property ${propertyName} is not a restricted property`);
        return;
      }

      // Function to check if any property is already set to 1 in another object
      const isPropertyUnique = (property) => {
        return !state.itemVariation.some(
          (item) => item[property] === 1 && item.ID !== itemId
        );
      };

      const item = state.itemVariation.find((item) => item.ID === itemId);

      if (item) {
        // Check if setting the property to 1 would violate the uniqueness constraint
        if (item[propertyName] === 0 && !isPropertyUnique(propertyName)) {
          alert(`Cannot set ${propertyName} to 1 for multiple objects`);
          return;
        }
        // Toggle the property value
        item[propertyName] = item[propertyName] === 0 ? 1 : 0;
      }
    },

    // toggleSelect(state, action) {
    //   const { itemId, propertyName } = action.payload;

    //   // Check if the property name is one of the restricted properties
    //   const restrictedProperties = [
    //     "FORSO",
    //     "FORPO",
    //     "FORPACKINGLIST",
    //     "FORINVOICE",
    //   ];
    //   if (!restrictedProperties.includes(propertyName)) {
    //     console.warn(`Property ${propertyName} is not a restricted property`);
    //     return;
    //   }

    //   // Function to check if any property is already set to 1 in another object
    //   const isPropertyUnique = (property) => {
    //     return !state.itemVariation.some(
    //       (item) => item[property] === 1 && item.ID !== itemId
    //     );
    //   };

    //   const item = state.itemVariation.find((item) => item.ID === itemId);

    //   if (item) {
    //     // Check if setting the property to 1 would violate the uniqueness constraint
    //     if (item[propertyName] === 0 && !isPropertyUnique(propertyName)) {
    //       alert(`Cannot set ${propertyName} to 1 for multiple objects`);
    //       return;
    //     } else {
    //       item[propertyName] = item[propertyName] === 0 ? 1 : 0;
    //     }
    //   }
    // },
    removeSelectedVariations(state) {
      state.itemVariation = state.itemVariation.filter(
        (variation) => !variation.isSelected
      );
    },
    removeSelectedVariationsFromTable(state) {
      const selectedItem = (state.itemVariation = state.itemVariation.filter(
        (variation) => !variation.isSelected
      ));

      console.log(selectedItem);
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
      })
      .addCase(deleteFromItemVariation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteFromItemVariation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.itemVariation = state.itemVariation.filter(
          (variation) => !variation.isSelected
        );
        console.log(action.payload); // Log success message
      })
      .addCase(deleteFromItemVariation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
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
  addData,
  resetDataArr,
  addItemVariation,
  addItemVariationNegativeId,
  toggleItemVariationSelection,
  toggleSelect,
  removeSelectedVariations,
  removeSelectedVariationsFromTable,
} = itemSlice.actions;
export default itemSlice.reducer;
