import { createSlice } from "@reduxjs/toolkit";

const attachmentSlice = createSlice({
  name: "attachment",
  initialState: {    
    attachmemts:null
  },
  reducers: {
    setAttachments(state,action) {
      state.attachmemts = action.payload.attachmemts
    }        
  },
});

export const attachmentActions = attachmentSlice.actions;

export default attachmentSlice;
