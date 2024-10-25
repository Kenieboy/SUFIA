// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";

import itemReducer from "./itemSlice";
import pddReducer from "./purchaseDDSlice";
import authReducer from "./authSlice";
import scReducer from "./standardConsumptionSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    itemData: itemReducer,
    pddData: pddReducer,
    scData: scReducer,
  },
});

export default store;
