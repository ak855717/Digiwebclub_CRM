const mongoose = require('mongoose');

const callLogSchema = new mongoose.Schema({
  recipient: {
    type: String,
    default: 'Unknown'
  },
  phoneNumber: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    default: 0
  },
  direction: {
    type: String,
    enum: ['Inbound', 'Outbound'],
    default: 'Outbound'
  },
  status: {
    type: String,
    required: true
  },
  callSid: {
    type: String
  },
  recordingUrl: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CallLog', callLogSchema);
