import { createSlice } from "@reduxjs/toolkit";

const locationSlice=createSlice({
    name:"locations",
    initialState: {    
        location:null,
        locationPermission:null, 
    },
    reducers: {
        setLocation(state, action){
            state.location=action.payload.location
        },
        setLocationPermission(state,action){
            state.locationPermission=action.payload.locationPermission
        }
    },    
});

export const locationActions=locationSlice.actions;
export default locationSlice;