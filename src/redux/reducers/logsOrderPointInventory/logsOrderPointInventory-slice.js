import { createSlice } from "@reduxjs/toolkit";

const logsOrderPointInventorySlice= createSlice({
    name:"logsOrderPointInventory",
    initialState:{ 
        AllLogsOrderPointInventory:null,  
        LogsOfOPI:null      
    },
    reducers:{
        setLogsOrderPointInventory(state, action){
            state.AllLogsOrderPointInventory=action.payload.AllLogsOrderPointInventory;        
        },
        setLogsOrderPointInventoryByOPIid(state, action){
            state.LogsOfOPI=action.payload.LogsOfOPI;        
        }
    }
});

export const logsOrderPointInventoryActions=logsOrderPointInventorySlice.actions;
export default logsOrderPointInventorySlice;
