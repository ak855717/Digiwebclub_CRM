const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Controller handling user login logic
  const loginUser = async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password) {
      return res.status(400).json({ success: false, error: 'User ID and password are required.' });
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid user ID or password.' });
    }

    // Compare passwords directly in controller using bcryptjs
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid user ID or password.' });
    }

    return res.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        userId: user.userId,
        employeeId: user.employeeId,
        role: user.role,
        permissions: user.permissions,
      },
    });
  } catch (error) {
    console.error('Login controller error:', error);
    return res.status(500).json({ success: false, error: 'An internal server error occurred.' });
  }
};

// Controller handling user creation by administrator
const createUser = async (req, res) => {
  try {
    const { name, employeeId, userId, password, role } = req.body;
    if (!name || !employeeId || !userId || !password) {
      return res.status(400).json({ success: false, error: 'All fields (name, employeeId, userId, password) are required.' });
    }

    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'A user with this User ID already exists.' });
    }

    // Hash password directly in controller using bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({ 
      name, 
      employeeId, 
      userId, 
      password: hashedPassword,
      role: role || 'employee'
    });
    return res.json({ success: true });
  } catch (error) {
    console.error('Create user controller error:', error);
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

    const validRoles = ['employee', 'manager', 'admin'];
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
        userId: updatedUser.userId,
        employeeId: updatedUser.employeeId,
        role: updatedUser.role,
        permissions: updatedUser.permissions,
      },
    });
  } catch (error) {
    console.error('updateUserRole controller error:', error);
    return res.status(500).json({ success: false, error: 'An internal server error occurred.' });
  }
};

// Controller handling password change by administrator
const updateUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({ success: false, error: 'New password must be at least 4 characters long.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { returnDocument: 'after' }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    return res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error('updateUserPassword controller error:', error);
    return res.status(500).json({ success: false, error: 'An internal server error occurred.' });
  }
};

// Controller handling user permissions update by administrator
const updateUserPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    if (!permissions) {
      return res.status(400).json({ success: false, error: 'Permissions object is required.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { permissions },
      { returnDocument: 'after', runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    return res.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error('updateUserPermissions controller error:', error);
    return res.status(500).json({ success: false, error: 'An internal server error occurred.' });
  }
};

module.exports = {
  loginUser,
  createUser,
  getUsers,
  updateUserRole,
  updateUserPassword,
  updateUserPermissions,
};
