import { createSlice } from "@reduxjs/toolkit";

const hubConnectionSlice = createSlice({
  name: "hubConnections",
  initialState: {    
    hubConnection: null,  
  },
  reducers: {
    setHubConnection(state,action){        
        state.hubConnection=action.payload.hubConnection;       
    }
  },
});

export const hubConnectionActions = hubConnectionSlice.actions;

export default hubConnectionSlice;
