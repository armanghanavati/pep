import { createSlice } from "@reduxjs/toolkit";

const companySlice=createSlice({
    name:"companies",
    initialState: {     
        company: null,  
      },
      reducers: {
          setCompany(state, action) {
            state.company = action.payload.company;
          },  
      },
    });

    export const companyActions = companySlice.actions;
    
    export default companySlice;