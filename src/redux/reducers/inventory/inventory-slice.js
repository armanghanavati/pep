import { createSlice } from "@reduxjs/toolkit";

const inventorySlice = createSlice({
  name: "inventories",
  initialState: {        
    allinventory:null,
    inventoryCombo:null,    
  },
  reducers: {    
    setAllInventory(state,action){
      state.allinventory=action.payload.allinventory
    },
    setInventoryCombo(state,action){
      state.inventoryCombo=action.payload.inventoryCombo
    }
  },
});

export const inventoryActions = inventorySlice.actions;

export default inventorySlice;
