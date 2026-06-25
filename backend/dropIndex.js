const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb://localhost:27017/CRM_calling';

const dropIndex = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    // Mongoose might have an old index for email. We need to drop it if it exists.
    try {
      await mongoose.connection.collection('users').dropIndex('email_1');
      console.log('Dropped old email index.');
    } catch (e) {
      console.log('No email index found or failed to drop:', e.message);
    }
    
    console.log('Index drop complete');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

dropIndex();
