import dbConnect from '@/lib/dbConnect';
import Meal from '@/models/mealModel';

export default async function handler(req, res) {
  await dbConnect();
  const { slug } = req.query;

  if (req.method === "GET") {
    try {
      const meal = await Meal.findOne({ slug })
        .populate({ path: 'comments.userId', model: 'User', select: 'name' });

      if (!meal) return res.status(404).json({ message: 'Meal not found' });

      res.status(200).json(meal);
    } catch (err) {
      console.error('Error fetching meal by slug:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
