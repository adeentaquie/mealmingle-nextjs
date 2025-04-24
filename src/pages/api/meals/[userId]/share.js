import dbConnect from "@/lib/dbConnect";
import Meal from "@/models/mealModel";
import User from "@/models/userModel";
import multer from "multer";
import path from "path";
import fs from "fs";

const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/images",
    filename: (req, file, cb) => {
      cb(null, `meal-${Date.now()}${path.extname(file.originalname)}`);
    },
  }),
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export const config = {
  api: {
    bodyParser: false, // Important: tells Next.js not to parse body
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await runMiddleware(req, res, upload.single("image"));
  await dbConnect();

  try {
    const { userId } = req.query;
    const numericUserId = parseInt(userId, 10);  // 👈 Convert string to number

    const { name, email, title, summary, instructions } = req.body;

    const newMeal = new Meal({
      title,
      slug: title.replace(/\s+/g, "-").toLowerCase(),
      image: `images/${req.file.filename}`,
      summary,
      instructions,
      creator: name,
      creator_email: email,
    });

    await newMeal.save();

    const user = await User.findOne({ userId: numericUserId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.mealsShared += 1;
    await user.save();

    return res.status(201).json({ message: "Meal shared successfully!" });
  } catch (err) {
    console.error("Meal share error:", err);
    return res.status(500).json({ message: "Something went wrong", error: err.message });
  }
}
