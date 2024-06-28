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
  lastUsedId: 0,
  purchaseDeliveryDetail: [],
  purchaseDelivery: [],
};

const pddSlice = createSlice({
  name: "pdd",
  initialState,
  reducers: {
    addPDDItem(state, action) {
      if (Array.isArray(action.payload)) {
        const updatedPayload = action.payload.map((item) => ({
          ...item,
          ID: --state.lastUsedId, // Decrementing the last used ID
        }));
        state.purchaseDeliveryDetail.push(...updatedPayload);
      } else {
        const updatedPayload = {
          ...action.payload,
          ID: --state.lastUsedId, // Decrementing the last used ID
        };
        state.purchaseDeliveryDetail.push(updatedPayload);
      }
    },
    addPDDItemEditMode(state, action) {
      return {
        ...state,
        purchaseDeliveryDetail: [
          ...state.purchaseDeliveryDetail,
          ...action.payload,
        ],
      };
    },
    updatePDDItem(state, action) {
      const { itemId, field, value } = action.payload;
      const item = state.purchaseDeliveryDetail.find(
        (item) => item.ITEMID === itemId
      );
      if (item) {
        if (field === "QTY" || field === "PRICE") {
          item[field] = value;
          item.AMOUNT = item.QTY * item.PRICE;
        } else {
          item[field] = value;
        }
      }
    },
    updatePDDItemvariationIdPrice(state, action) {
      const { itemId, ID, COST, ITEMUNITDESCRIPTION } = action.payload;

      const item = state.purchaseDeliveryDetail.find(
        (item) => item.ITEMID === itemId
      );

      if (item) {
        item.ITEMVARIATIONID = ID;
        item.CODE = ITEMUNITDESCRIPTION;
        item.PRICE = COST;
        item.AMOUNT = item.QTY * item.PRICE;
      }
    },

    addPurchaseDelivery(state, action) {
      state.purchaseDelivery.push(action.payload);
    },
    removePurchaseDeliveryDetail(state, action) {
      return {
        ...state,
        purchaseDeliveryDetail: state.purchaseDeliveryDetail.filter(
          (detail) => detail.ID !== action.payload
        ),
      };
    },
    resetPurchaseDetailData(state, action) {
      state.purchaseDeliveryDetail = [];
      state.purchaseDelivery = [];
      state.lastUsedId = 0;
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

export const {
  addPDDItem,
  addPDDItemEditMode,
  addPurchaseDelivery,
  updatePDDItem,
  updatePDDItemvariationIdPrice,
  removePurchaseDeliveryDetail,
  resetPurchaseDetailData,
} = pddSlice.actions;
export default pddSlice.reducer;
