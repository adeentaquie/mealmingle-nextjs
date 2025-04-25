// src/components/MealItem.jsx
import Link from 'next/link';
import classes from './MealItem.module.css'; // Adjusted className

export default function MealItem({ title, slug, image, summary, creator, userid }) {
    const mealUrl = `/meals/${userid}/meal/${slug}`;  // Make sure `slug` and `userid` are defined

    return (
      <article className={classes.meal}>
      <header>
        <div className={classes.image}>
          <img src={image || "/placeholder.svg"} alt={title} className={classes.image} />
        </div>
        <div className={classes.headerText}>
          <h2>{title}</h2>
          <p>by {creator}</p>
        </div>
      </header>
      <div className={classes.content}>
        <p className={classes.summary}>{summary}</p>
        <div className={classes.actions}>
          <Link href={mealUrl}>View Details</Link>
        </div>
      </div>
    </article>
    );
}
