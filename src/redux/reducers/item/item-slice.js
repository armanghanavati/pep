import { createSlice } from "@reduxjs/toolkit";

const itemSlice = createSlice({
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

export const itemActions = itemSlice.actions;

export default itemSlice;
