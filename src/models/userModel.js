import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);

const UserSchema = new mongoose.Schema(
  {
    userId: { type: Number, unique: true }, // Auto-incremented userId
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mealsShared: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
  },
  { timestamps: true }
);

if (!mongoose.models.User) {
  UserSchema.plugin(AutoIncrement, { inc_field: 'userId' });
}

export default mongoose.models.User || mongoose.model('User', UserSchema);
