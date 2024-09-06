// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";

import itemReducer from "./itemSlice";
import pddReducer from "./purchaseDDSlice";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    itemData: itemReducer,
    pddData: pddReducer,
  },
});

export default store;
