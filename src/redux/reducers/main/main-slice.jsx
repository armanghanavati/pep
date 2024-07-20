import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  messageModal: { title: "", show: false },
  showToast: { Message: "", Type: "", isToastVisible: false },
  questionModal: { show: false, answer: false },
  isLoading: { btnName: "", stateWait: false },
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
    RsetQuestionModal: (state, actions) => {
      return { ...state, questionModal: actions.payload };
    },
    RsetIsLoading: (state, actions) => {
      return { ...state, isLoading: actions.payload };
    },
  },
});

export const {
  RsetIsLoading,
  RsetShowToast,
  RsetMessageModal,
  RsetQuestionModal,
} = mainSlice.actions;
export default mainSlice;
