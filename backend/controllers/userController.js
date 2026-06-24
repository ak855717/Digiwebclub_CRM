const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Controller handling user login logic
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    // Compare passwords directly in controller using bcryptjs
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    return res.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login controller error:', error);
    return res.status(500).json({ success: false, error: 'An internal server error occurred.' });
  }
};

// Controller handling user signup logic
const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'A user with this email already exists.' });
    }

    // Hash password directly in controller using bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({ name, email, password: hashedPassword });
    return res.json({ success: true });
  } catch (error) {
    console.error('Signup controller error:', error);
    return res.status(500).json({ success: false, error: 'An internal server error occurred.' });
  }
};

// Controller handling user fetching for administrator
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Find all users, exclude password hashes
    return res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('getUsers controller error:', error);
    return res.status(500).json({ success: false, error: 'An internal server error occurred.' });
  }
};

// Controller handling user role updating by administrator
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ success: false, error: 'Role is required.' });
    }

    const validRoles = ['user', 'admin', 'manager', 'employee'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role configuration.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { returnDocument: 'after', runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    return res.json({
      success: true,
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error('updateUserRole controller error:', error);
    return res.status(500).json({ success: false, error: 'An internal server error occurred.' });
  }
};

module.exports = {
  loginUser,
  signupUser,
  getUsers,
  updateUserRole,
};
