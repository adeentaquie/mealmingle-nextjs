import dbConnect from '@/lib/dbConnect';
import Meal from '@/models/mealModel';

export default async function handler(req, res) {
  const { userId, slug } = req.query;

  await dbConnect();

  if (req.method === 'DELETE') {
    try {
      const meal = await Meal.findOne({ slug, creatorId: userId });
      
      if (!meal) {
        return res.status(404).json({ message: 'Meal not found or unauthorized' });
      }
      await Meal.deleteOne({ slug });

      res.status(200).json({ message: 'Meal removed successfully' });
    } catch (error) {
      console.error('Error removing meal:', error);
      res.status(500).json({ message: 'Failed to remove meal' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
} 