// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";

import itemReducer from "./itemSlice";

const store = configureStore({
  reducer: {
    itemData: itemReducer,
  },
});

export default store;
