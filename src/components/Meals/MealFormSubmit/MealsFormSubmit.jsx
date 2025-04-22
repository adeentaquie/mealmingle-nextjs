export default function MealsFormSubmit({ isSubmitting }) {
    return (
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Share Meal"}
      </button>
    );
  }
  