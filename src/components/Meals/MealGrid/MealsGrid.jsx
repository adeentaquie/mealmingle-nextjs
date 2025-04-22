// src/components/MealsGrid.jsx
import MealItem from '@/components/Meals/MealItem/MealItem';
import classes from './MealsGrid.module.css'; // Adjusted className

export default function MealsGrid({ meals,userid }) {
  return (
    <ul className={classes.meals}>
      {meals.map((meal) => (
        <li key={meal.slug}>
          <MealItem 
            title={meal.title} 
            slug={meal.slug} 
            image={`http://localhost:5000/${meal.image}`}  // Correct URL structure
            summary={meal.summary} 
            creator={meal.creator} 
            userid={userid}

          />

        </li>
      ))}
    </ul>
  );
}