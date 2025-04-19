// src/redux/dashboardSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Initial state for the dashboard
const initialState = {
  name: "", // Add name to the initial state
  mealsShared: 0,
  comments: 0,
  sharedMeals: [],
  commentsList: [],
  loading: false,
  errorMessage: "",
};

// Redux slice for handling dashboard data
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    // Set dashboard data on successful fetch
    fetchDashboardSuccess: (state, action) => {
      const { name, mealsShared, comments, sharedMeals, commentsList } = action.payload;
      state.name = name;
      state.mealsShared = mealsShared;
      state.sharedMeals = sharedMeals;
      state.commentsList = commentsList;
      state.comments = commentsList.length; // ✅ Use actual length of the list
      state.loading = false;
      state.errorMessage = null;
    },
    
    // Handle dashboard fetch error
    fetchDashboardFailure: (state, action) => {
      state.errorMessage = action.payload.message;
      state.loading = false;

    },
    // Set loading state during dashboard fetch
    setLoading: (state) => {
      state.loading = true;
    },
    // Reset the dashboard state
    resetDashboard: (state) => {
      state.name = "";
      state.mealsShared = 0;
      state.comments = 0;
      state.sharedMeals = [];        // ✅ clear meals
      state.commentsList = [];      // ✅ clear comments
      state.loading = false;
      state.errorMessage = "";
    },
    
  },
});

export const { fetchDashboardSuccess, fetchDashboardFailure, setLoading, resetDashboard } = dashboardSlice.actions;
export const selectDashboard = (state) => state.dashboard; // Selector to get dashboard state

export default dashboardSlice.reducer;
