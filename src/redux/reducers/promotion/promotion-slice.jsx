import { createSlice } from "@reduxjs/toolkit";

const promotionSlice = createSlice({
  name: "items",
  initialState: {        
    allItems:null,
    itemCombo:null,    
  },
  reducers: {    
    setAllItems(state,action){
      state.allItems=action.payload.allItems
    },
    setItemCombo(state,action){
      state.itemCombo=action.payload.itemCombo
    }
  },
});

export const itemActions = promotionSlice.actions;

export default promotionSlice;
