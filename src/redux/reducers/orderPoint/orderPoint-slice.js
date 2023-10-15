import { createSlice } from "@reduxjs/toolkit";

const orderPointSlice= createSlice({
    name:"orderPoint",
    initialState:{ 
        orderPoint:null,        
    },
    reducers:{
        setOrderPoint(state, action){
            state.orderPoint=action.payload.orderPoint;        
        }
    }
});

export const orderPointActions=orderPointSlice.actions;
export default orderPointSlice;
