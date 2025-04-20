import dbConnect from '@/lib/dbConnect';
import User from '@/models/userModel';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  await dbConnect();

  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      message: 'User created successfully',
      userId: newUser.userId, // Return auto-incremented userId
    });
  } catch (error) {
    console.error('Error during user signup:', error);
    return res.status(500).json({ message: 'Server error, please try again later' });
  }
}
