import React from "react";
import styles from "@/styles/Dashboard.module.css"; // CSS styles for the dashboard

const Dashboard = ({ dashboardData, errorMessage }) => {
  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <h1>Welcome, {dashboardData.name}!</h1>

      <div className={styles.dashboardInfo}>
        <div>
          <h2>Your Meals Shared: {dashboardData.mealsShared}</h2>
          <ul>
            {dashboardData.sharedMeals.length > 0 ? (
              dashboardData.sharedMeals.map((meal) => (
                <li key={meal._id}>
                  <img
                    src={`http://localhost:3000/${meal.image}`} // Assuming backend serves static files
                    alt={meal.title}
                    width="60"
                  />
                  <a href={`/meals/${meal.slug}`}>{meal.title}</a>
                </li>
              ))
            ) : (
              <p>No shared meals found.</p>
            )}
          </ul>
        </div>

        <div>
          <h2>Your Comments: {dashboardData.comments}</h2>
          <ul className={styles.commentsList}>
            {dashboardData.commentsList.length > 0 ? (
              dashboardData.commentsList.map((comment, idx) => (
                <li key={idx} className={styles.commentItem}>
                  <div className={styles.commentContent}>
                    <strong>On {comment.mealTitle}:</strong>
                    <p>"{comment.commentText}"</p>
                  </div>
                  <div className={styles.commentDate}>
                    <em>Posted on {comment.createdAt}</em>
                  </div>
                </li>
              ))
            ) : (
              <p>No comments found.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Fetching data using getServerSideProps to run the API call on the server side
export async function getServerSideProps({ params }) {
  const { userId } = params; // Extract userId from URL params

  const apiUrl = `http://localhost:3000/api/dashboard/${userId}`; // API endpoint

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok) {
      return {
        props: {
          errorMessage: data.message || "Failed to load dashboard data.",
        },
      };
    }

    // Convert date on the server-side
    const commentsList = data.commentsList.map((comment) => ({
      ...comment,
      createdAt: new Date(comment.createdAt).toLocaleDateString(),
    }));

    return {
      props: {
        dashboardData: { ...data, commentsList }, // Pass the converted date data
      },
    };
  } catch (error) {
    return {
      props: {
        errorMessage: "Error fetching dashboard data.",
      },
    };
  }
}

export default Dashboard;
