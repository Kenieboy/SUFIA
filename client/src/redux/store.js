// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";

import itemReducer from "./itemSlice";
import pddReducer from "./purchaseDDSlice";

const store = configureStore({
  reducer: {
    itemData: itemReducer,
    pddData: pddReducer,
  },
});

export default store;
