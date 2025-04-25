// pages/meals/[userId].js
import { useState } from 'react';
import MealsGrid from '@/components/Meals/MealGrid/MealsGrid';
import classes from '@/styles/MealsPage.module.css';
import Link from "next/link"
export default function MealsPage({ meals, userId, error }) {
  const [loading, setLoading] = useState(false);

  return (
    <>
       <header className={classes.header}>
        <h1>
          Delicious meals, created <span className={classes.highlight}>by your community</span>
        </h1>
        <p>Choose your favorite recipe and cook it yourself. It is easy and fun!</p>
        <p className={classes.cta}>
          <Link href={`/meals/${userId}/share`}>Share Your Favorite Recipe</Link>
        </p>
      </header>
      <main className={classes.main}>
        {loading ? (
          <p className={classes.loading}>Fetching meals...</p>
        ) : error ? (
          <p className={classes.error}>{error}</p>
        ) : (
          <MealsGrid meals={meals} userid={userId} />
        )}
      </main>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { userId } = params;

  try {
    const res = await fetch(`http://localhost:3000/api/meals/${userId}`);
    const meals = await res.json();

    if (!meals || meals.length === 0) {
      return {
        props: {
          meals: [],
          userId,
          error: 'No meals found for this user',
        },
      };
    }

    return {
      props: {
        meals,
        userId,
        error: null,
      },
    };
  } catch (error) {
    return {
      props: {
        meals: [],
        userId,
        error: 'Failed to load meals',
      },
    };
  }
}
