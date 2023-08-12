import { createSlice } from "@reduxjs/toolkit";

const locationSlice=createSlice({
    name:"locations",
    initialState:{
        state:{
            locations:null
        },
        reducer:{
            setLocation(state, action){
                state.locations=action.payload.locations
            }
        }
    }
});

export const locationActions=locationSlice.actions;
export default locationSlice;