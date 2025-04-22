// pages/api/meals/[userId].js
import dbConnect from '@/lib/dbConnect';
import Meal from '@/models/mealModel';

export default async function handler(req, res) {
  await dbConnect();

  const { userId } = req.query;

  if (req.method === 'GET') {
    try {
      const meals = await Meal.find();  // Adjust this to match your schema

      if (!meals || meals.length === 0) {
        return res.status(404).json({ message: 'No meals found for this user' });
      }

      res.status(200).json(meals);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch meals', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
