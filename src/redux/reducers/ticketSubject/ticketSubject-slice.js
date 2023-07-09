import { createSlice } from "@reduxjs/toolkit";

const ticketSubjectSlice = createSlice({
  name: "ticketSubjects",
  initialState: {        
    ticketSubjects:null,
  },
  reducers: {    
    setTicketSubjects(state,action){
      state.ticketSubjects=action.payload.ticketSubjects;
    }
  },
});

export const ticketSubjectActions = ticketSubjectSlice.actions;

export default ticketSubjectSlice;
