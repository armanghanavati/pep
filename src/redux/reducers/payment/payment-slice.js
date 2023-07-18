import { createSlice } from "@reduxjs/toolkit";

const paymentSlice = createSlice({
  name: "payment",
  initialState: {    
    stateOfRequestPayment: false,
    stateOfConfirmPayment:false
  },
  reducers: {
    enableRequestPayment(state) {
      state.stateOfRequestPayment = true;
    },
    disableRequestPayment(state) {
      state.stateOfRequestPayment = false;
    },
    enableConfirmPayment(state) {
      state.stateOfConfirmPayment = true;
    },
    disableConfirmPayment(state) {
      state.stateOfConfirmPayment = false;
    }
  },
});

export const paymentActions = paymentSlice.actions;

export default paymentSlice;