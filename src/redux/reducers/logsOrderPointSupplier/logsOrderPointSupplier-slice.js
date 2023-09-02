import { createSlice } from "@reduxjs/toolkit";

const logsOrderPointSupplierSlice= createSlice({
    name:"logsOrderPointSuppliers",
    initialState:{ 
        AllLogsOrderPointSupplier:null,  
        LogsOfOPS:null      
    },
    reducers:{
        setLogsOrderPointSupplier(state, action){
            state.AllLogsOrderPointSupplier=action.payload.AllLogsOrderPointSupplier;        
        },
        setLogsOrderPointSupplierByOPSid(state, action){
            state.LogsOfOPS=action.payload.LogsOfOPS;        
        }
    }
});

export const logsOrderPointSupplierActions=logsOrderPointSupplierSlice.actions;
export default logsOrderPointSupplierSlice;
