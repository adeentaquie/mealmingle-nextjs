import { useState, useEffect } from "react"
import Link from "next/link"
import classes from "./MealItem.module.css"

export default function MealItem({ title, slug, image, summary, creator, userid, _id }) {
  const mealUrl = `/meals/${userid}/meal/${slug}`
  const [isFavorited, setIsFavorited] = useState(false)
  
  
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await fetch(`/api/favorites/status?userId=${userid}&mealId=${_id}`);
        if (response.ok) {
          const data = await response.json();
          setIsFavorited(data.isFavorited);
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };
    
    if (userid && _id) {
      checkFavoriteStatus();
    }
  }, [userid, _id]);

  const toggleFavorite = async (e) => {
    e.preventDefault(); 
    setIsFavorited((prev) => !prev)
    
    try {
      const res = await fetch("/api/favorites/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          userId: userid, 
          mealId: _id 
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setIsFavorited((prev) => !prev);
        alert(data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error:", error);
      setIsFavorited((prev) => !prev);
      alert("Failed to update favorite status. Please try again.");
    }
  }

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
          <button
            className={`${classes.favoriteBtn} ${isFavorited ? classes.favorited : ""}`}
            onClick={toggleFavorite}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <svg
              className={classes.favoriteIcon}
              width="24"
              height="24"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className={isFavorited ? classes.heartFilled : classes.heartOutline}
                d="M1,21c0,20,31,38,31,38s31-18,31-38c0-8.285-6-16-15-16c-8.285,0-16,5.715-16,14c0-8.285-7.715-14-16-14C7,5,1,12.715,1,21z"
              />
            </svg>
          </button>
          <Link href={mealUrl}>View Details</Link>
        </div>
      </div>
    </article>
  )
}