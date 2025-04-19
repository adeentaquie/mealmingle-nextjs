// src/redux/slideshowSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Initial state for the image slideshow
const initialState = {
  currentImageIndex: 0, // Start with the first image
};

// Redux slice for the slideshow
const slideshowSlice = createSlice({
  name: "slideshow",
  initialState,
  reducers: {
    // Set the current image index
    setCurrentImageIndex: (state, action) => {
      state.currentImageIndex = action.payload;
    },
    // Increment the current image index
    nextImage: (state) => {
      state.currentImageIndex =
        state.currentImageIndex < 6 ? state.currentImageIndex + 1 : 0;
    },
    // Decrement the current image index
    prevImage: (state) => {
      state.currentImageIndex =
        state.currentImageIndex > 0 ? state.currentImageIndex - 1 : 6;
    },
  },
});

export const { setCurrentImageIndex, nextImage, prevImage } = slideshowSlice.actions;
export const selectSlideshow = (state) => state.slideshow; // Selector to get slideshow state

export default slideshowSlice.reducer;
