import { createSlice } from "@reduxjs/toolkit";

const ticketPrioritySlice = createSlice({
  name: "ticketPriority",
  initialState: {        
    ticketPriority:null,
  },
  reducers: {    
    setTicketPriority(state,action){
      state.ticketPriority=action.payload.ticketPriority;
    }
  },
});

export const ticketPriorityActions = ticketPrioritySlice.actions;

export default ticketPrioritySlice;
