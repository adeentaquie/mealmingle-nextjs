import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/userModel";

export default async function handler(req, res) {
    if(req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }
    
    const { userId, mealId } = req.query;
    
    if (!userId || !mealId) {
        return res.status(400).json({ message: "Missing userId or mealId" });
    }
    
    try {
        await dbConnect();
        
        // Find user by numeric userId
        const user = await userModel.findOne({ userId: parseInt(userId) });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Check if meal is in favorites
        const isFavorited = user.favoritedMeals.some(id => id.toString() === mealId);
        
        return res.status(200).json({ isFavorited });
    } catch(error) {
        console.error("Error checking favorites:", error);
        return res.status(500).json({ message: "Server error" });
    }
} 