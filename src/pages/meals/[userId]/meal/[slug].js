import { useRouter } from "next/router";
import dbConnect from "@/lib/dbConnect";


import classes from "@/styles/MealDetailPage.module.css";
import { useState } from "react";


export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking", // blocking to generate on first request
  };
}

export async function getStaticProps(context) {
  const { userId, slug } = context.params;

  try {
    const { default: dbConnect } = await import('@/lib/dbConnect');
    const { default: Meal } = await import('@/models/mealModel');
    const { default: User } = await import('@/models/userModel'); // ✅ Dynamic Import

    await dbConnect();

    const meal = await Meal.findOne({ slug })
      .populate({ path: "comments.userId", select: "name" })
      .lean();

    if (!meal) {
      return { notFound: true };
    }

    return {
      props: {
        meal: JSON.parse(JSON.stringify(meal)),
        userId,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}




export default function MealDetailPage({ meal, userId }) {
  const router = useRouter();
  
  const [comments, setComments] = useState(
    meal.comments?.map((c, i) => ({
      id: i + 1,
      user: c.userId?.name || "Anonymous",
      text: c.commentText,
      date: new Date(c.createdAt).toISOString().split("T")[0],
    })) || []
  );
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (router.isFallback) {
    return <p>Loading...</p>;
  }

  const formattedInstructions = meal.instructions?.replace(/\n/g, "<br/>") || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/meals/${userId}/${meal.slug}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(userId),
          commentText: newComment,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const newC = {
        id: comments.length + 1,
        user: data.comment.user,
        text: data.comment.text,
        date: data.comment.date,
      };

      setComments((prev) => [...prev, newC]);
      setNewComment("");
    } catch (err) {
      alert("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <section className={classes.commentsSection}>
        <div className={classes.commentsHeader}>
          <h2>Comments</h2>
        </div>

        <div className={classes.commentsList}>
          {comments.map((c) => (
            <div key={c.id} className={classes.commentCard}>
              <div className={classes.commentHeader}>
                <span className={classes.commentUser}>{c.user}</span>
                <span className={classes.commentDate}>{c.date}</span>
              </div>
              <p className={classes.commentText}>{c.text}</p>
            </div>
          ))}
        </div>

        <form className={classes.commentForm} onSubmit={handleSubmit}>
          <div className={classes.formGroup}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className={classes.commentTextarea}
              placeholder="Add your comment..."
              required
            />
          </div>
          <button
            type="submit"
            className={classes.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      </section>
    </>
  );
}
