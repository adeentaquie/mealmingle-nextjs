// src/redux/signupSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Initial state for the sign-up process
const initialState = {
  userId: null,
  loading: false,
  errorMessage: "",
};

// Redux slice for handling the sign-up process
const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    // Set user data on successful sign-up
    signupSuccess: (state, action) => {
      state.userId = action.payload.userId;
      state.loading = false;
      state.errorMessage = "";
    },
    // Handle sign-up error
    signupFailure: (state, action) => {
      state.errorMessage = action.payload.message;
      state.loading = false;
    },
    // Set loading state during sign-up
    setLoading: (state) => {
      state.loading = true;
    },
    // Reset sign-up state (e.g., for logouts or fresh starts)
    resetSignup: (state) => {
      state.userId = null;
      state.loading = false;
      state.errorMessage = "";
    },
  },
});

export const { signupSuccess, signupFailure, setLoading, resetSignup } = signupSlice.actions;
export const selectSignup = (state) => state.signup; // Selector to get signup state

export default signupSlice.reducer;
