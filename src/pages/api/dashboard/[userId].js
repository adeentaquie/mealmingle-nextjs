// /pages/api/dashboard/[userId].js
import dbConnect from '../../../lib/dbConnect';  // MongoDB connection logic
import User from '../../../models/userModel';    // Your User model

export default async function handler(req, res) {
  const { userId } = req.query;

  // Connect to the database
  await dbConnect();

  try {
    // Fetch user data from MongoDB
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user data
    res.status(200).json({
      mealsShared: user.mealsShared,
      comments: user.comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
}
