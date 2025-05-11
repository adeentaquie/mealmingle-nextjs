import React, { useState } from "react";
import Head from "next/head";
import styles from "@/styles/Dashboard.module.css"; 
import Link from "next/link";

const Dashboard = ({ dashboardData, errorMessage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sharedMeals, setSharedMeals] = useState(dashboardData.sharedMeals);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleRemoveMeal = async (slug) => {
    if (!confirm('Are you sure you want to remove this meal?')) {
      return;
    }

    try {
      const response = await fetch(`/api/meals/${dashboardData.userId}/${slug}/remove`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the meal from the local state
        setSharedMeals(prevMeals => prevMeals.filter(meal => meal.slug !== slug));
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to remove meal');
      }
    } catch (error) {
      console.error('Error removing meal:', error);
      alert('Failed to remove meal. Please try again.');
    }
  };

  if (errorMessage) {
    return (
      <>
        <Head>
          <title>Error - MealMingle Dashboard</title>
        </Head>
        <div className={styles.errorMessage}>{errorMessage}</div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{dashboardData.name}'s Dashboard - MealMingle</title>
      </Head>
      <div className={styles.dashboardWrapper}>
        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div 
            className={styles.overlay} 
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarHeader}>
            <Link href="/home"><h2>MealMingle</h2></Link>
            <button 
              className={styles.closeSidebar}
              onClick={toggleSidebar}
              aria-label="Close sidebar menu"
            >
              &times;
            </button>
          </div>

          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {dashboardData.name.charAt(0)}
            </div>
            <span>{dashboardData.name}</span>
          </div>

          <nav className={styles.sidebarNav}>
            <Link href={`/dashboard/${dashboardData.userId}`} className={`${styles.navLink} ${styles.active}`}>
              <span className={styles.navIcon}>📊</span>
              Dashboard
            </Link>
            <Link href={`/meals/${dashboardData.userId}`} className={styles.navLink}>
              <span className={styles.navIcon}>🍽️</span>
              All Meals 
            </Link>
            <Link href={`/meals/${dashboardData.userId}/share`} className={styles.navLink}>
              <span className={styles.navIcon}>➕</span>
              Add New Meal
            </Link>
            <Link href="/community" className={styles.navLink}>
              <span className={styles.navIcon}>👥</span>
              Community
            </Link>
            <div className={styles.navDivider}></div>
            <Link href="/" className={styles.navLink}>
              <span className={styles.navIcon}>🚪</span>
              Logout
            </Link>
          </nav>
        </aside>

        {/* Main content area */}
        <main className={styles.dashboardContainer}>
          <div className={styles.dashboardHeader}>
            <button 
              className={styles.menuButton} 
              onClick={toggleSidebar}
              aria-label="Open menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <h1>Dashboard</h1>
            <p className={styles.welcomeMessage}>Welcome back, <span>{dashboardData.name}</span>!</p>
          </div>
          
          {/* Stats Overview */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🍽️</div>
              <div className={styles.statInfo}>
                <h3>Meals Shared</h3>
                <p className={styles.statValue}>{dashboardData.mealsShared}</p>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>❤️</div>
              <div className={styles.statInfo}>
                <h3>Favorites</h3>
                <p className={styles.statValue}>{dashboardData.favoritesCount}</p>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>💬</div>
              <div className={styles.statInfo}>
                <h3>Comments</h3>
                <p className={styles.statValue}>{dashboardData.comments}</p>
              </div>
            </div>
          </div>

          {/* Dashboard Widgets Grid */}
          <div className={styles.widgetsGrid}>
            {/* Shared Meals Widget */}
            <div className={styles.widget}>
              <div className={styles.widgetHeader}>
                <h2>Your Meals</h2>
                <Link href={`/meals/${dashboardData.userId}/share`} className={styles.actionButton}>
                  + Share New
                </Link>
              </div>
              <div className={styles.widgetContent}>
                {sharedMeals.length > 0 ? (
                  <ul className={styles.mealsList}>
                    {sharedMeals.map((meal) => (
                      <li key={meal._id} className={styles.mealItem}>
                        <img
                          src={`/${meal.image}`}
                          alt={meal.title}
                          className={styles.mealImage}
                        />
                        <div className={styles.mealInfo}>
                          <Link href={`/meals/${dashboardData.userId}/meal/${meal.slug}`}>
                            {meal.title}
                          </Link>
                        </div>
                        <button
                          className={styles.removeButton}
                          aria-label="Remove meal"
                          onClick={() => handleRemoveMeal(meal.slug)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={styles.emptyState}>
                    <p>You haven't shared any meals yet</p>
                    <Link href={`/meals/${dashboardData.userId}/share`} className={styles.emptyStateButton}>
                      Share Your First Recipe
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Favorite Meals Widget */}
            <div className={styles.widget}>
              <div className={styles.widgetHeader}>
                <h2>Favorites</h2>
                <Link href="/community" className={styles.actionButton}>
                  Explore More
                </Link>
              </div>
              <div className={styles.widgetContent}>
                {dashboardData.favoriteMeals && dashboardData.favoriteMeals.length > 0 ? (
                  <ul className={styles.mealsList}>
                    {dashboardData.favoriteMeals.map((meal) => (
                      <li key={meal._id} className={styles.mealItem}>
                        <img
                          src={`/${meal.image}`}
                          alt={meal.title}
                          className={styles.mealImage}
                        />
                        <div className={styles.mealInfo}>
                          <Link href={`/meals/${dashboardData.userId}/meal/${meal.slug}`}>
                            {meal.title}
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={styles.emptyState}>
                    <p>No favorite meals yet</p>
                    <Link href="/community" className={styles.emptyStateButton}>
                      Discover Recipes
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Comments Widget */}
            <div className={styles.widget}>
              <div className={styles.widgetHeader}>
                <h2>Recent Comments</h2>
              </div>
              <div className={styles.widgetContent}>
                {dashboardData.commentsList.length > 0 ? (
                  <ul className={styles.commentsList}>
                    {dashboardData.commentsList.map((comment, idx) => (
                      <li key={idx} className={styles.commentItem}>
                        <div className={styles.commentContent}>
                          <strong>On {comment.mealTitle}:</strong>
                          <p>"{comment.commentText}"</p>
                        </div>
                        <div className={styles.commentDate}>
                          <span>{comment.createdAt}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={styles.emptyState}>
                    <p>You haven't commented on any meals</p>
                    <Link href="/community" className={styles.emptyStateButton}>
                      Explore Community
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
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
        dashboardData: { 
          ...data, 
          commentsList,
          userId // Add userId to enable proper links
        },
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
