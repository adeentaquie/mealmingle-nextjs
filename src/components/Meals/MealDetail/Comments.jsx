import { useState } from "react";
import classes from "@/styles/MealDetailPage.module.css";

export default function Comments({ mealSlug, userId, initialComments }) {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/meals/${userId}/${mealSlug}/comment`, {
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
  );
}
