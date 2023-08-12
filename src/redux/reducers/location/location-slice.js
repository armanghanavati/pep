import { createSlice } from "@reduxjs/toolkit";

const locationSlice=createSlice({
    name:"locations",
    initialState: {    
        locations:null  
    },
    reducers: {
        setLocation(state, action){
            state.locations=action.payload.locations
        }
    },    
});

export const locationActions=locationSlice.actions;
export default locationSlice;