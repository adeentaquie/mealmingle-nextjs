import dbConnect from '@/lib/dbConnect';
import Meal from '@/models/mealModel';
import User from '@/models/userModel';

export default async function handler(req, res) {
  await dbConnect();
  const { slug } = req.query;

  if (req.method === 'POST') {
    const { userId, commentText } = req.body;

    if (!userId || !commentText) {
      return res.status(400).json({ error: 'Missing userId or commentText' });
    }

    try {
      const meal = await Meal.findOne({ slug });
      if (!meal) return res.status(404).json({ error: 'Meal not found' });

      const user = await User.findOne({ userId });
      if (!user) return res.status(404).json({ error: 'User not found' });

      const newComment = {
        userId: user._id,
        commentText,
        createdAt: new Date(),
      };

      meal.comments.push(newComment);
      await meal.save();

      await User.findByIdAndUpdate(user._id, { $inc: { comments: 1 } });

      res.status(200).json({
        message: 'Comment added successfully',
        comment: {
          id: meal.comments.length,
          user: user.name,
          text: commentText,
          date: new Date().toISOString().split('T')[0],
        },
      });
    } catch (err) {
      console.error('Error posting comment:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
