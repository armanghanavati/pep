import { createSlice } from "@reduxjs/toolkit";

const orderPointSupplierSlice= createSlice({
    name:"orderPointSuppliers",
    initialState:{ 
        orderPointSupplier:null,        
    },
    reducers:{
        setOrderPointSupplier(state, action){
            state.orderPointSupplier=action.payload.orderPointSupplier;        
        }
    }
});

export const orderPointSupplierActions=orderPointSupplierSlice.actions;
export default orderPointSupplierSlice;
