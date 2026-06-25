const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  category: { type: String },
  applicationNo: { type: String },
  sector: { type: String },
  title: { type: String },
  name: { type: String, required: true },
  designation: { type: String },
  company: { type: String },
  unitName: { type: String },
  add1: { type: String },
  add2: { type: String },
  add3: { type: String },
  cityPinCode: { type: String },
  state: { type: String },
  dearSirMadam: { type: String },
  phone: { type: String, required: true },
  mobile: { type: String },
  email: { type: String, required: true },
  trophy1: { type: String },
  trophy2: { type: String },
  award: { type: String },
  status: { type: String, default: 'New' }
}, { strict: false, timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
