// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // Import the login (auth) slice reducer
import signupReducer from './slices/signupSlice'; // Import the signup slice reducer
import slideshowReducer from "./slices/slideshowSlice"; // Import the new slideshow slice


// Configure the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer, // Handle authentication related state (login)
    signup: signupReducer,
    slideshow: slideshowReducer, // Add the slideshow slice to the store

  },
});

export default store;
