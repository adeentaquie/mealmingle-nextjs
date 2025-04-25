import classes from "@/styles/MealDetailPage.module.css";

export default function MealDetails({ meal }) {
  const formattedInstructions = meal.instructions?.replace(/\n/g, "<br/>") || "";

  return (
    <>
      <header className={classes.header}>
        <div className={classes.image}>
          <img src={`/${meal.image}`} alt={meal.title} />
        </div>
        <div className={classes.headerText}>
          <h1>{meal.title}</h1>
          <p className={classes.creator}>
            by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
          </p>
          <p className={classes.summary}>{meal.summary}</p>
        </div>
      </header>

      <main>
        <p
          className={classes.instructions}
          dangerouslySetInnerHTML={{ __html: formattedInstructions }}
        ></p>
      </main>
    </>
  );
}
