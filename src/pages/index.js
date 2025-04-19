import { useState } from "react";
import { useRouter } from "next/router"; // replace useNavigate
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, loginFailure, setLoading } from "../redux/slices/authSlice";
import styles from "@/styles/Login.module.css"; // Adjust path as needed
import Image from "next/image";
import logo from "../../public/images/logo.png"
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, errorMessage } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter(); // use this instead of useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading());

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("name", data.name);

        dispatch(loginSuccess({ userId: data.userId, name: data.name }));

        router.push("/home"); // Redirect to home
      } else {
        dispatch(loginFailure({ message: data.message || "Invalid email or password" }));
      }
    } catch (error) {
      dispatch(loginFailure({ message: "Something went wrong. Please try again later." }));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.overlay}>
          <div className={styles.content}>
            <h1>Meal Mingle</h1>
            <p>Share your culinary creations with the world</p>
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <div className={styles.logoContainer}>
            <Image src={logo} alt="Meal Mingle Logo" width={50} height={50} className={styles.logo} />
            <h2>Meal Mingle</h2>
          </div>

          <h3>Welcome back</h3>
          <p className={styles.subtitle}>Log in to share your delicious creations</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.passwordHeader}>
                <label htmlFor="password">Password</label>
                <a href="/forgot-password" className={styles.forgotPassword}>Forgot password?</a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className={styles.rememberMe}>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me for 30 days</label>
            </div>

            <button type="submit" className={styles.loginButton} disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}

          <div className={styles.divider}>
            <span>OR</span>
          </div>

          <p className={styles.signupText}>
            Don't have an account?{" "}
            <a href="/signup" className={styles.signupLink}>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
