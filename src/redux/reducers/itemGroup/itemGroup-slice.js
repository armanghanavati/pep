import { createSlice } from "@reduxjs/toolkit";

const itemGroupSlice = createSlice({
  name: "itemGroup",
  initialState: {        
    allItemGroup:null,
    itemGroupCombo:null,    
  },
  reducers: {    
    setAllItemGroup(state,action){
      state.allItemGroup=action.payload.allItemGroup
    },
    setItemGroupCombo(state,action){
      state.itemGroupCombo=action.payload.itemGroupCombo
    }
  },
});

export const itemGroupActions = itemGroupSlice.actions;

export default itemGroupSlice;
