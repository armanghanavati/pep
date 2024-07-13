import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  messageModal: { title: "", show: false },
  showToast: { Message: "", Type: "", isToastVisible: false },
  showQuestionModal: { show: false, answer: false },
  showLoading: { btnName: "", value: false },
};

const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    RsetMessageModal: (state, actions) => {
      return { ...state, messageModal: actions.payload };
    },
    RsetShowToast: (state, actions) => {
      return { ...state, showToast: actions.payload };
    },
  },
});

export const { RsetShowToast, RsetMessageModal } = mainSlice.actions;
export default mainSlice;
