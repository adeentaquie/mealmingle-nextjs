// CSR is being used without SWR because Form + API, no need to preload data , cant use Swr either since were posting data not getting it

import { useState } from "react";
import { useRouter } from "next/navigation"; // For navigation
import { useDispatch, useSelector } from "react-redux";
import {
  signupSuccess,
  signupFailure,
  setLoading,
  selectSignup,
} from "@/redux/slices/signupSlice"; // Adjust if your path is different
import styles from "@/styles/SignUpForm.module.css";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const dispatch = useDispatch();
  const router = useRouter();

  // Select state from Redux
  const { loading, errorMessage } = useSelector(selectSignup);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Full name is required";
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 3) {
      errors.password = "Password should be at least 3 characters long";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    dispatch(setLoading());

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userId", data.userId);
        dispatch(signupSuccess({ userId: data.userId }));
        router.push(`/`);
      } else {
        dispatch(signupFailure({ message: data.message }));
      }
    } catch (err) {
      dispatch(signupFailure({ message: "Something went wrong. Please try again." }));
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        <div className={styles.signupHeader}>
          <h1>Join Us</h1>
          <p>Create your account and start your journey</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.signupForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
            {validationErrors.name && (
              <p className={styles.errorText}>{validationErrors.name}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />
            {validationErrors.email && (
              <p className={styles.errorText}>{validationErrors.email}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 3 characters"
              required
            />
            {validationErrors.password && (
              <p className={styles.errorText}>{validationErrors.password}</p>
            )}
          </div>

          <button type="submit" className={styles.signupButton}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {loading && <p className={styles.loadingText}>Please wait, creating your account...</p>}
        {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}

        <div className={styles.loginLink}>
          Already have an account? <a href="/">Log in</a>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
