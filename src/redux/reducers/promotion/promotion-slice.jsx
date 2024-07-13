import { createSlice } from "@reduxjs/toolkit";

const promotionSlice = createSlice({
  name: "items",
  initialState: {
    allItems: null,
    toast: {
      isToastVisible: false,
      Message: "",
      Type: "",
    },
  },
  reducers: {
    setAllItems(state, action) {
      state.allItems = action.payload.allItems;
    },
    setItemCombo(state, action) {
      state.itemCombo = action.payload.itemCombo;
    },
    // RsetToast(state, payload) {
    //   return ...state = payload.toast
    // },
  },
});

export const itemActions = promotionSlice.actions;

export default promotionSlice;
