import { createSlice } from "@reduxjs/toolkit";

const orderPointInventorySlice= createSlice({
    name:"orderPointInventory",
    initialState:{ 
        orderPointInventory:null,        
    },
    reducers:{
        setOrderPointInventory(state, action){
            state.orderPointInventory=action.payload.orderPointInventory;        
        }
    }
});

export const orderPointInventoryActions=orderPointInventorySlice.actions;
export default orderPointInventorySlice;
