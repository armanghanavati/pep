import { createSlice } from "@reduxjs/toolkit";

const customerSlice = createSlice({
  name: "customer",
  initialState: {
    location: null,
    locationPermission: null,
  },
  reducers: {
    setLocation(state, action) {
      state.location = action.payload.location;
    },
    setLocationPermission(state, action) {
      state.locationPermission = action.payload.locationPermission;
    },
  },
});

export const customerActions = customerSlice.actions;
export default customerSlice;
