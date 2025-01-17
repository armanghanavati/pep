
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {    
    userId: null,
    token:null,
    permissions:null,    
  },
  reducers: {
    setUser(state,action){        
        state.userId=action.payload.userId;
        state.token=action.payload.token;
        state.permissions=action.payload.permissions;        
    },    
  },
});

export const userActions = userSlice.actions;

export default userSlice;
