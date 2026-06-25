const mongoose = require('mongoose');
const User = require('./models/userModel');
require('dotenv').config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/digiwebclub', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to DB');

    // Mongoose might have an old index for email. We need to drop it if it exists.
    try {
      await mongoose.connection.collection('users').dropIndex('email_1');
      console.log('Dropped old email index.');
    } catch (e) {
      console.log('No email index found or failed to drop:', e.message);
    }

    const users = await User.find({});
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      let updated = false;

      // Extract raw document from mongoose
      const doc = user.toObject ? user.toObject() : user;

      if (!doc.userId) {
        // use their email username as userId
        const newUserId = doc.email ? doc.email.split('@')[0] : `user_${user._id.toString().slice(-4)}`;
        user.userId = newUserId;
        updated = true;
      }
      if (!doc.employeeId) {
        user.employeeId = `EMP-${user._id.toString().slice(-4).toUpperCase()}`;
        updated = true;
      }

      if (updated) {
        await user.save();
        console.log(`Updated user ${user.name} with User ID: ${user.userId} and Employee ID: ${user.employeeId}`);
      }
    }

    console.log('Migration complete');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

migrate();
