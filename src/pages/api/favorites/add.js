import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/userModel";
import mealModel from "@/models/mealModel";
import mongoose from 'mongoose';

export default async function handler(req, res) {
    if(req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
    
    const { userId, mealId } = req.body;
    
    if (!userId || !mealId) {
        return res.status(400).json({ message: "Missing userId or mealId" });
    }
    
    try {
        await dbConnect();
        
        // Find user by userId (numeric) not MongoDB _id
        const user = await userModel.findOne({ userId: parseInt(userId) });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Check if meal exists
        const meal = await mealModel.findById(mealId);
        
        if (!meal) {
            return res.status(404).json({ message: "Meal not found" });
        }
        
        // Check if meal is already in favorites
        const isFavorited = user.favoritedMeals.some(id => id.toString() === mealId);
        
        if (isFavorited) {
            user.favoritedMeals = user.favoritedMeals.filter(id => id.toString() !== mealId);
        } else {
            user.favoritedMeals.push(mealId);
        }
        
        await user.save();
        
        res.status(200).json({ 
            message: isFavorited ? "Removed from favorites" : "Added to favorites", 
            favorited: !isFavorited 
        });  
    } catch(error) {
        console.error("Favorites error:", error);
        res.status(500).json({ message: "Server error" });
    }
}