import { useState, useEffect } from "react";
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

  // Add validation state
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    title: false,
    summary: false,
    instructions: false,
    image: false,
  });

  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formStage, setFormStage] = useState(0);

  // Animation effect when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (value.trim() !== "") {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleImageChange = (image) => {
    setFormData((prev) => ({ ...prev, image }));
    
    // Clear image error when an image is selected
    if (image) {
      setErrors(prev => ({ ...prev, image: false }));
    }
  };

  // Validate specific stage fields
  const validateStage = (stage) => {
    let isValid = true;
    const newErrors = { ...errors };
    
    if (stage === 0) {
      // Validate name and email
      if (!formData.name.trim()) {
        newErrors.name = true;
        isValid = false;
      }
      
      if (!formData.email.trim()) {
        newErrors.email = true;
        isValid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        // Basic email validation
        newErrors.email = true;
        isValid = false;
      }
    } else if (stage === 1) {
      // Validate title, summary, and instructions
      if (!formData.title.trim()) {
        newErrors.title = true;
        isValid = false;
      }
      
      if (!formData.summary.trim()) {
        newErrors.summary = true;
        isValid = false;
      }
      
      if (!formData.instructions.trim()) {
        newErrors.instructions = true;
        isValid = false;
      }
    } else if (stage === 2) {
      // Validate image
      if (!formData.image) {
        newErrors.image = true;
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const validateForm = () =>
    Object.values(formData).every((val) => val !== null && val !== "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    if (!validateStage(2) || !validateForm()) {
      setMessage("Please fill in all fields and select an image.");
      return;
    }

    setIsSubmitting(true);
    const mealData = new FormData();
    Object.entries(formData).forEach(([key, val]) => mealData.append(key, val));

    try {
      const res = await fetch(`/api/meals/${userId}/share`, {
        method: "POST",
        body: mealData,
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("Meal shared successfully!");
        setTimeout(() => {
          router.push(`/meals/${userId}`);
        }, 1500);
      } else {
        setMessage(data.message || "Failed to share meal.");
      }
    } catch (err) {
      setMessage("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStage = () => {
    // Validate current stage before proceeding
    if (validateStage(formStage) && formStage < 2) {
      setFormStage(formStage + 1);
    }
  };

  const prevStage = () => {
    if (formStage > 0) {
      setFormStage(formStage - 1);
    }
  };

  return (
    <div className={classes.pageContainer}>
      <div className={classes.backgroundElements}>
        <div className={classes.circle1}></div>
        <div className={classes.circle2}></div>
        <div className={classes.circle3}></div>
      </div>

      <header className={classes.header}>
        <h1>
          Share your <span className={classes.highlight}>favorite meal</span>
        </h1>
        <p>Or any other meal you feel needs sharing!</p>
      </header>

      <main className={classes.main}>
        {showForm && (
          <div className={`${classes.formContainer} ${classes.fadeIn}`}>
            <form className={classes.form} onSubmit={handleSubmit}>
              {formStage === 0 && (
                <div className={`${classes.formStage} ${classes.slideIn}`}>
                  <h2 className={classes.stageTitle}>About You</h2>
                  <div className={classes.row}>
                    <div className={classes.inputGroup}>
                      <label htmlFor="name">Your name <span className={classes.required}>*</span></label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        onChange={handleChange}
                        value={formData.name}
                        className={`${classes.animatedInput} ${errors.name ? classes.inputError : ''}`}
                        required
                      />
                      {errors.name && (
                        <span className={classes.errorText}>Name is required</span>
                      )}
                    </div>
                    <div className={classes.inputGroup}>
                      <label htmlFor="email">Your email <span className={classes.required}>*</span></label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        onChange={handleChange}
                        value={formData.email}
                        className={`${classes.animatedInput} ${errors.email ? classes.inputError : ''}`}
                        required
                      />
                      {errors.email && (
                        <span className={classes.errorText}>Please enter a valid email</span>
                      )}
                    </div>
                  </div>
                  <div className={classes.navigationButtons}>
                    <button
                      type="button"
                      onClick={nextStage}
                      className={classes.nextButton}
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              )}

              {formStage === 1 && (
                <div className={`${classes.formStage} ${classes.slideIn}`}>
                  <h2 className={classes.stageTitle}>Meal Details</h2>
                  <div className={classes.inputGroup}>
                    <label htmlFor="title">Title <span className={classes.required}>*</span></label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      onChange={handleChange}
                      value={formData.title}
                      className={`${classes.animatedInput} ${errors.title ? classes.inputError : ''}`}
                      required
                    />
                    {errors.title && (
                      <span className={classes.errorText}>Title is required</span>
                    )}
                  </div>
                  <div className={classes.inputGroup}>
                    <label htmlFor="summary">Short Summary <span className={classes.required}>*</span></label>
                    <input
                      type="text"
                      id="summary"
                      name="summary"
                      onChange={handleChange}
                      value={formData.summary}
                      className={`${classes.animatedInput} ${errors.summary ? classes.inputError : ''}`}
                      required
                    />
                    {errors.summary && (
                      <span className={classes.errorText}>Summary is required</span>
                    )}
                  </div>
                  <div className={classes.inputGroup}>
                    <label htmlFor="instructions">Instructions <span className={classes.required}>*</span></label>
                    <textarea
                      id="instructions"
                      name="instructions"
                      rows="10"
                      onChange={handleChange}
                      value={formData.instructions}
                      className={`${classes.animatedTextarea} ${errors.instructions ? classes.inputError : ''}`}
                      required
                    />
                    {errors.instructions && (
                      <span className={classes.errorText}>Instructions are required</span>
                    )}
                  </div>
                  <div className={classes.navigationButtons}>
                    <button
                      type="button"
                      onClick={prevStage}
                      className={classes.backButton}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStage}
                      className={classes.nextButton}
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              )}

              {formStage === 2 && (
                <div className={`${classes.formStage} ${classes.slideIn}`}>
                  <h2 className={classes.stageTitle}>Upload Image</h2>
                  <div className={classes.imagePickerWrapper}>
                    <ImagePicker
                      label="Your Image"
                      name="image"
                      onImageChange={handleImageChange}
                    />
                    {errors.image && (
                      <span className={classes.errorText}>Please select an image</span>
                    )}
                  </div>

                  {message && (
                    <div
                      className={`${classes.message} ${
                        message.includes("success")
                          ? classes.successMessage
                          : classes.errorMessage
                      }`}
                    >
                      {message}
                    </div>
                  )}

                  <div className={classes.navigationButtons}>
                    <button
                      type="button"
                      onClick={prevStage}
                      className={classes.backButton}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={classes.submitButton}
                    >
                      {isSubmitting ? (
                        <span className={classes.loadingSpinner}>
                          <span className={classes.spinnerDot}></span>
                          <span className={classes.spinnerDot}></span>
                          <span className={classes.spinnerDot}></span>
                        </span>
                      ) : (
                        "Share Meal"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </main>
    </div>
  );
}