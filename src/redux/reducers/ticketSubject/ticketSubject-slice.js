import { createSlice } from "@reduxjs/toolkit";

const ticketSubjectSlice = createSlice({
  name: "ticketSubjects",
  initialState: {    
    allTicketSubjects:null,
    parentTicketSubjects:null,
    childTicketSubjects:null      
  },
  reducers: {    
    setAllTicketSubjects(state,action){
      state.allTicketSubjects=action.payload.allTicketSubjects;
    },  
    setTicketSubjectParents(state,action){
      state.parentTicketSubjects=action.payload.parentTicketSubjects
    },  
    setTicketSubjectChilds(state,action){
      state.childTicketSubjects=action.payload.childTicketSubjects
    }
  },
});

export const ticketSubjectActions = ticketSubjectSlice.actions;

export default ticketSubjectSlice;
