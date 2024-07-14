import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  multiSelect: {},
};

const promotionSlice = createSlice({
  name: "promotion",
  initialState,
  reducers: {
    RsetMultiSelect: (state, actions) => {
      return { ...state, multiSelect: actions.payload };
    },
  },
});

export const { RsetMultiSelect } = promotionSlice.actions;
export default promotionSlice;

// const initialState = {
//   messageModal: { title: "", show: false },
//   showToast: { Message: "", Type: "", isToastVisible: false },
//   questionModal: { show: false, answer: false },
//   isLoading: { btnName: "", stateWait: false },
// };

// const mainSlice = createSlice({
//   name: "main",
//   initialState,
//   reducers: {
//     RsetMultiSelect: (state, actions) => {
//       return { ...state, messageModal: actions.payload };
//     },
//     RsetShowToast: (state, actions) => {
//       return { ...state, showToast: actions.payload };
//     },
//     RsetQuestionModal: (state, actions) => {
//       return { ...state, questionModal: actions.payload };
//     },
//     RsetIsLoading: (state, actions) => {
//       return { ...state, isLoading: actions.payload };
//     },
//   },
// });

// export const {
//   RsetIsLoading,
//   RsetShowToast,
//   RsetMultiSelect,
//   RsetQuestionModal,
// } = mainSlice.actions;
// export default mainSlice;
