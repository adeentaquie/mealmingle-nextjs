import { useState, useRef } from "react";
import classes from "./ImagePicker.module.css"; // Assuming CSS styles

export default function ImagePicker({ label, name, onImageChange }) {
  const [pickedImage, setPickedImage] = useState(null);
  const imageInput = useRef(); // Create a reference for the file input

  // Handle file input change
  function handleImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      setPickedImage(URL.createObjectURL(file)); // Preview the image
      onImageChange(file); // Pass the selected image to the parent component
    }
  }

  // Trigger the file input when the button is clicked
  function handlePickClick() {
    imageInput.current.click(); // Programmatically click the file input
  }

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {pickedImage ? (
            <img
              src={pickedImage}
              alt="Preview"
              className={classes.previewImage} // Applying specific CSS class
            />
          ) : (
            <p>No image picked yet</p>
          )}
        </div>

        {/* File input element (hidden visually but still focusable) */}
        <input
          className={classes.input}
          type="file"
          id={name}
          accept="image/png, image/jpeg"
          name={name}
          ref={imageInput} // Reference to the file input
          onChange={handleImageChange}
          required
        />

        {/* Button that triggers the file input */}
        <button className={classes.button} type="button" onClick={handlePickClick}>
          Pick an Image
        </button>
      </div>
    </div>
  );
}
