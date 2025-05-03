// src/components/MealsGrid.jsx
import MealItem from '@/components/Meals/MealItem/MealItem';
import classes from './MealsGrid.module.css'; // Adjusted className

export default function MealsGrid({ meals, userid }) {
  return (
    <ul className={classes.meals}>
    {meals.map((meal) => (
      <li key={meal.slug}>
        <MealItem
          title={meal.title}
          slug={meal.slug}
          image={`/${meal.image}`}
          summary={meal.summary}
          creator={meal.creator}
          userid={userid}
          _id={meal._id}
        />
      </li>
    ))}
  </ul>
  );
}