import { createSlice } from "@reduxjs/toolkit";
import { StateStoring } from "devextreme-react/data-grid";

const positionSlice= createSlice({
    name:"positions",
    initialState:{ 
        position:null,
        positionTop:null
    },
    reducers:{
        setPosition(state, action){
            state.position=action.payload.position;
            state.positionTop=action.payload.positionTop;
        }
    }
});

export const positionActions=positionSlice.actions;
export default positionSlice;
