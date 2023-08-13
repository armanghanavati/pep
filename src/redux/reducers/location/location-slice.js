import { createSlice } from "@reduxjs/toolkit";

const locationSlice=createSlice({
    name:"locations",
    initialState: {    
        locations:null,
        locationPermission:null, 
    },
    reducers: {
        setLocation(state, action){
            state.locations=action.payload.locations
        },
        setLocationPermission(state,action){
            state.locationPermission=action.payload.locationPermission
        }
    },    
});

export const locationActions=locationSlice.actions;
export default locationSlice;