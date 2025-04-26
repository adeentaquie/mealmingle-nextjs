import dbConnect from '../../../lib/dbConnect';  // MongoDB connection logic
import User from '../../../models/userModel';    // User model
import Meal from '../../../models/mealModel';    // Meal model

export default async function handler(req, res) {
  const { userId } = req.query;

  // Connect to the database
  await dbConnect();

  try {
    // Fetch user data from MongoDB using userId
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get meals shared by the user
    const sharedMeals = await Meal.find({ creatorId: user.userId }).select('title slug image');

    // Get all meals where the user has commented
    const mealsWithComments = await Meal.find({ "comments.userId": user._id })
      .select("title slug comments");

    // Extract comments and include meal title and slug
    const userComments = [];
    mealsWithComments.forEach(meal => {
      meal.comments.forEach(comment => {
        if (comment.userId.toString() === user._id.toString()) {
          userComments.push({
            mealTitle: meal.title,  // Access the meal title directly
            mealSlug: meal.slug,    // Access the meal slug directly
            commentText: comment.commentText,
            createdAt: comment.createdAt,
          });
        }
      });
    });

    // Return the data in a structured format
    res.status(200).json({
      name: user.name,
      mealsShared: sharedMeals.length,
      comments: userComments.length,
      sharedMeals,
      commentsList: userComments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
}
