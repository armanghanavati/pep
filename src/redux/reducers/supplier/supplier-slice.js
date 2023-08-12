import { createSlice } from "@reduxjs/toolkit";

const supplierSlice = createSlice({
  name: "supplier",
  initialState: {        
    allSuppliers:null
  },
  reducers: {    
    setAllSuppliers(state,action){
      state.allSuppliers=action.payload.allSuppliers
    },
  },
});

export const supplierActions = supplierSlice.actions;

export default supplierSlice;
