import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  commentText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const mealSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    summary: { type: String, required: true },
    instructions: { type: String, required: true },
    creator: { type: String, required: true },
    creator_email: { type: String, required: true },
    comments: [commentSchema],
  },
  { timestamps: true }
);

// Prevent model overwrite in dev (important in Next.js hot-reloading)
export default mongoose.models.Meal || mongoose.model('Meal', mealSchema);
