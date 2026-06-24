const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  leadName: { 
    type: String, 
    required: true 
  },
  phoneNumber: {
    type: String
  },
  description: { 
    type: String 
  },
  scheduledAt: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Completed'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('FollowUp', followUpSchema);
