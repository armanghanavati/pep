import { createSlice } from "@reduxjs/toolkit";

const ticketSlice = createSlice({
  name: "ticket",
  initialState: {    
    stateOfNewTicket: false,
    ticketSubjects:null,
    allTickets:null
  },
  reducers: {
    enableNewTicket(state) {
      state.stateOfNewTicket = true;
    },
    disableNewTicket(state) {
      state.stateOfNewTicket = false;
    },    
    setAllTicket(state,action){
      state.allTickets=action.payload.allTickets
    },
  },
});

export const ticketActions = ticketSlice.actions;

export default ticketSlice;
