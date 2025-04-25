import { useRouter } from "next/router";
import  MealDetails  from "@/components/Meals/MealDetail/MealDetails";
import Comments from "@/components/Meals/MealDetail/Comments";

export async function getStaticPaths() {
  try {
    const { default: dbConnect } = await import('@/lib/dbConnect');
    const { default: Meal } = await import('@/models/mealModel');
    await dbConnect();

    // Fetch all meals (only slug and creatorId)
    const meals = await Meal.find({}, 'slug creatorId').lean();

    const paths = meals.map((meal) => ({
      params: {
        userId: String(meal.creatorId), // Make sure it's a string
        slug: meal.slug,
      },
    }));

    return {
      paths,
      fallback: "blocking",
    };
  } catch (error) {
    console.error("Error in getStaticPaths:", error);
    return {
      paths: [],
      fallback: false,
    };
  }
}


export async function getStaticProps(context) {
  const { userId, slug } = context.params;

  try {
    const { default: dbConnect } = await import('@/lib/dbConnect');
    const { default: Meal } = await import('@/models/mealModel');
    const { default: User } = await import('@/models/userModel'); 

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

  if (router.isFallback) {
    return <p>Loading...</p>;
  }

  const initialComments = meal.comments?.map((c, i) => ({
    id: i + 1,
    user: c.userId?.name || "Anonymous",
    text: c.commentText,
    date: new Date(c.createdAt).toISOString().split("T")[0],
  })) || [];

  return (
    <>
      <MealDetails meal={meal} />
      <Comments mealSlug={meal.slug} userId={userId} initialComments={initialComments} />
    </>
  );
}
