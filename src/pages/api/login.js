import dbConnect from '@/lib/dbConnect';
import User from '@/models/userModel';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  await dbConnect();

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    return res.status(200).json({
      message: 'Login successful',
      userId: user.userId,
      name: user.name, // Optional: to store/display user's name
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error, please try again later' });
  }
}
