// /pages/dashboard/[userId].js
import React from 'react';

const Dashboard = ({ dashboardData, errorMessage }) => {
  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Total Meals Shared: {dashboardData.mealsShared}</h2>
      <h2>Total Comments: {dashboardData.comments}</h2>
    </div>
  );
};

// `getServerSideProps` runs on the server side to fetch data before rendering the page
export async function getServerSideProps({ params }) {
  const { userId } = params;

  const apiUrl = `http://localhost:3000/api/dashboard/${userId}`; // Full URL to your API route

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok) {
      return {
        props: {
          errorMessage: data.message || 'Failed to load dashboard data.',
        },
      };
    }

    return {
      props: {
        dashboardData: data, // Pass the fetched data as props
      },
    };
  } catch (error) {
    return {
      props: {
        errorMessage: 'Error fetching dashboard data.',
      },
    };
  }
}

export default Dashboard;
