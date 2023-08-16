
import { createSlice } from "@reduxjs/toolkit";

const orderInventorySlice = createSlice({
  name: "orderInventory",
  initialState: {    
    orders:null  
  },
  reducers: {
    setOrders(state,action){        
        state.orders=action.payload.orders;        
    },    
  },
});

export const orderInventoryActions = orderInventorySlice.actions;

export default orderInventorySlice;
