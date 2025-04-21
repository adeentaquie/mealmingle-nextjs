const mongoose = require('mongoose');
const mongooseSequence = require('mongoose-sequence')(mongoose);  // Correctly import the plugin

// Define the User Schema
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

// Use the plugin only once to auto-increment userId
UserSchema.plugin(mongooseSequence, { inc_field: 'userId' });

// Export the model
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
