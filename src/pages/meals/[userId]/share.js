// pages/meals/[userId]/share.js
import { useState } from "react";
import { useRouter } from "next/router";
import ImagePicker from "@/components/Meals/ImagePicker/ImagePicker"; // Update path as needed
import classes from "@/styles/ShareMealPage.module.css";

export default function ShareMealPage() {
  const router = useRouter();
  const { userId } = router.query;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    summary: "",
    instructions: "",
    image: null,
  });

  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (image) => {
    setFormData((prev) => ({ ...prev, image }));
  };

  const validateForm = () =>
    Object.values(formData).every((val) => val !== null && val !== "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setMessage("Please fill in all fields and select an image.");
      return;
    }

    setIsSubmitting(true);
    const mealData = new FormData();
    Object.entries(formData).forEach(([key, val]) =>
      mealData.append(key, val)
    );

    try {
      const res = await fetch(`/api/meals/${userId}/share`, {
        method: "POST",
        body: mealData,
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("Meal shared successfully!");
        router.push(`/meals/${userId}`);
      } else {
        setMessage(data.message || "Failed to share meal.");
      }
    } catch (err) {
      setMessage("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className={classes.header}>
        <h1>
          Share your <span className={classes.highlight}>favorite meal</span>
        </h1>
        <p>Or any other meal you feel needs sharing!</p>
      </header>
      <main className={classes.main}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <div className={classes.row}>
            <label htmlFor="name">Your name</label>
            <input type="text" id="name" name="name" onChange={handleChange} required />
            <label htmlFor="email">Your email</label>
            <input type="email" id="email" name="email" onChange={handleChange} required />
          </div>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" onChange={handleChange} required />
          <label htmlFor="summary">Short Summary</label>
          <input type="text" id="summary" name="summary" onChange={handleChange} required />
          <label htmlFor="instructions">Instructions</label>
          <textarea id="instructions" name="instructions" rows="10" onChange={handleChange} required />
          <ImagePicker label="Your Image" name="image" onImageChange={handleImageChange} />
          {message && <p>{message}</p>}
          <button type="submit" disabled={isSubmitting} className={classes.submitButton}>
            {isSubmitting ? "Submitting..." : "Share Meal"}
          </button>
        </form>
      </main>
    </>
  );
}
