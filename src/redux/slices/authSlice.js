import { createSlice } from "@reduxjs/toolkit";

// Initial state for the user authentication
const initialState = {
  userId: null,
  name: "", // Store the user's name
  isAuthenticated: false,
  errorMessage: "",
  loading: false,
};

// Redux slice for authentication
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set user data on login
    loginSuccess: (state, action) => {
      state.userId = action.payload.userId;
      state.name = action.payload.name; // Set the user's name when logging in
      state.isAuthenticated = true;
      state.errorMessage = "";
      state.loading = false;
    },
    // Handle login error
    loginFailure: (state, action) => {
      state.errorMessage = action.payload.message;
      state.loading = false;
    },
    // Set loading state during login
    setLoading: (state) => {
      state.loading = true;
    },
    // Logout user and reset state
    logout: (state) => {
      state.userId = null;
      state.name = ""; // Reset the user's name on logout
      state.isAuthenticated = false;
      state.errorMessage = "";
      state.loading = false;
    },
  },
});

// Actions
export const { loginSuccess, loginFailure, setLoading, logout } = authSlice.actions;

// Selector
export const selectAuth = (state) => state.auth; // Selector to get auth state

export default authSlice.reducer;