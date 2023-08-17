import { createSlice } from "@reduxjs/toolkit";

const companySlice=createSlice({
    name:"companies",
    initialState: {     
        company: null, 
        currentCompanyId:1, 
      },
      reducers: {
          setCompany(state, action) {
            state.company = action.payload.company;
          },  
          setCompanyCombo(state, action) {
            state.companyCombo = action.payload.companyCombo;
          },  
          setCurrentCompanyId(state, action) {
            state.currentCompanyId = action.payload.currentCompanyId;
          },  
      },
    });

    export const companyActions = companySlice.actions;
    
    export default companySlice;