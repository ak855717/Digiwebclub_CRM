const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://inotebook:ayush2004@inotebook.ogkw3y9.mongodb.net/?appName=inotebook/Digiwebclub_calling';

async function connectDb() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully via Mongoose.');

    // Seed default admin account using direct bcrypt hashing
    const User = require('../models/userModel');
    const admin = await User.findOne({ userId: 'admin' });
    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin', salt);

      await User.create({
        name: 'Administrator',
        userId: 'admin',
        employeeId: 'EMP-ADMIN',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('CRM_calling database seeded with default admin account: userId: admin / admin (bcrypt)');
    }
  } catch (err) {
    console.error('Failed to connect to MongoDB in Mongoose config:', err);
    process.exit(1);
  }
}

module.exports = {
  connectDb,
};

// acc: admin, pass: admin