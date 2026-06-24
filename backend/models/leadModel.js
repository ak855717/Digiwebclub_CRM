const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, default: 'New' },
  campaign: { type: String },
  progress: { type: Number, default: 10 },
  leadDate: { type: String },
  areaZone: { type: String },
  businessName: { type: String },
  address: { type: String },
  googleMap: { type: String },
  website: { type: String },
  instagram: { type: String },
  facebook: { type: String },
  twitterX: { type: String },
  youtube: { type: String },
  remark: { type: String },
  startCallDate: { type: String },
  lastCallDate: { type: String },
  remark2: { type: String },
}, { strict: false, timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
