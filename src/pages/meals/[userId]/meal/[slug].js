import { useRouter } from "next/router";
import dbConnect from "@/lib/dbConnect";
import classes from "@/styles/MealDetailPage.module.css";
import  MealDetails  from "@/components/Meals/MealDetail/MealDetails";
import Comments from "@/components/Meals/MealDetail/Comments";

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
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
