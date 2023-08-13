import { createSlice } from "@reduxjs/toolkit";

const supplierSlice = createSlice({
  name: "supplier",
  initialState: {        
    allSuppliers:null,
    activeSuppliers:null,    
  },
  reducers: {    
    setAllSuppliers(state,action){
      state.allSuppliers=action.payload.allSuppliers
    },
    setActiveSuppliers(state,action){
      state.activeSuppliers=action.payload.activeSuppliers
    }
  },
});

export const supplierActions = supplierSlice.actions;

export default supplierSlice;
