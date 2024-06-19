import { getPurchaseDeliveryDetail } from "@/query/itemRequest";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPurchaseDetailId = createAsyncThunk(
  "item/fetchPurchaseDetailId",

  async (ID, thunkAPI) => {
    try {
      const data = await getPurchaseDeliveryDetail(ID);
      if (!data || Object.keys(data).length === 0) {
        return null;
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

const initialState = {
  purchaseDeliveryDetail: [],
};

const pddSlice = createSlice({
  name: "pdd",
  initialState,
  reducers: {
    addPDDItem(state, action) {
      state.purchaseDeliveryDetail.push(action.payload);
    },
    resetPurchaseDetailData(state, action) {
      state.purchaseDeliveryDetail = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseDetailId.fulfilled, (state, action) => {
        state.purchaseDeliveryDetail.push(action.payload);
      })
      .addCase(fetchPurchaseDetailId.rejected, (state, action) => {
        console.log("Failed to fetch item variation:", action.payload.error);
      });
  },
});

export const { addPDDItem, resetPurchaseDetailData } = pddSlice.actions;
export default pddSlice.reducer;
